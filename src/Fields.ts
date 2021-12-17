import { Filter, Schema } from "./Interfaces";

interface InvalidField {
    field: string;
    message: string;
};

export interface RunFieldsReturn<D> {
    valid: boolean;
    invalidFields: Array<InvalidField>;
    sanitizedFields: D;
}

interface IFields<D> {
    readonly defaultFilters: Filter[];
    readonly schema: Schema;
    readonly data: D;

    runFields(data: D, schema?: any, struct?: string): RunFieldsReturn<D>;
}

class Fields<D> implements IFields<D> {

    readonly defaultFilters: Filter[] = [];

    constructor(
        readonly schema: Schema,
        readonly data: D,
    ) { };

    /* 
        "data" is the data to be filtered
        "schema" is the Filters and the information required to validate the data
        "struct" is the Structure of the current loop, so if some data is not allowed its gonna print out like: contact.address.street
    */
    runFields<D2 = D>(data?: D2 | D, schema?: Schema, struct?: string): RunFieldsReturn<D> {
        schema = schema || this.schema;
        data = data || this.data;

        for (const schemaKey in schema) {
            if (schema[schemaKey] === null) {
                schema[schemaKey] = {
                    filters: [],
                    required: true,
                }
            }
        }

        let invalidFields: Array<InvalidField> = [];
        let sanitizedFields: D = <any>{};

        // Loop through all schema keys
        for (const schemaKey in schema) {
            const schemaValue = <Schema>schema[schemaKey];

            // If the schemaKey is another schema then it is going to validate the data using the schema inside that schemaKey
            if (schemaValue !== null && schemaValue !== undefined && (schemaValue.required !== true && schemaValue.required !== false) && !schemaValue.filters && !schemaValue.maxLength) {
                const { valid, invalidFields: invalidFieldsReturned, sanitizedFields: sanitizedFieldsReturned } = this.runFields((<any>data)[schemaKey], schemaValue, `${struct !== undefined ? `${struct}.` : ''}${schemaKey}`);
                (<any>sanitizedFields)[schemaKey] = sanitizedFieldsReturned;
                // If there was any error validating the data its going to add it to invalidFields
                if (valid === false) {
                    invalidFields = [
                        ...invalidFields,
                        ...invalidFieldsReturned,
                    ];
                }
            }

            // Adding default filters
            schemaValue.filters = [
                ...schemaValue.filters || [],
                ...this.defaultFilters,
            ];

            // "arr" is the current invalid fields
            const arrayWithInvalidField = (arr: Array<InvalidField>, invalidField: string, failMessage: string) => {
                let array = [...arr];

                const field = `${struct !== undefined ? `${struct}.` : ''}${invalidField}`;

                array.push({
                    field,
                    message: failMessage,
                })

                return array;
            }

            // "dataValue" is the data with the same key as the current schemaKey
            const dataValue = (<any>data)[schemaKey];

            //The data is invalid(null || undefined) and it is not false  // Making sure that the schemaValue is a field and not another schema                                                      // The required is true
            if ((!dataValue && dataValue !== false) && ((schemaValue.filters?.length || 0) > 0 || schemaValue.maxLength !== undefined || schemaValue.required !== undefined) && (schemaValue.required === true || schemaValue.required === undefined)) {
                // It gets here if the data is a nullish value and the field is set to null or if the field.required is set to true 
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    schemaKey,
                    "This field is required and it must not be null or undefined"
                );
                continue;
            } else if (schemaValue && schemaValue.maxLength && Number.isInteger(schemaValue.maxLength) && dataValue && dataValue.length > schemaValue.maxLength) {
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    schemaKey,
                    `The max length for this field is ${schemaValue.maxLength} characters!`
                );
                continue;
            }

            const validateFilters = schemaValue.filters.filter(filter => filter.type === "validate") || [];
            const sanitizeFilters = schemaValue.filters.filter(filter => filter.type === "sanitize") || [];

            let validatedByFilters = true;

            for (const validateFilter of validateFilters) {
                const valid = validateFilter.filter(dataValue);
                if (dataValue === undefined || dataValue === null) break;
                if (!valid) {
                    invalidFields = arrayWithInvalidField(
                        invalidFields,
                        schemaKey,
                        validateFilter.failMessage || "",
                    );
                    validatedByFilters = false;
                    break;
                }
            }

            if (!validatedByFilters) continue;

            let sanitizedData = dataValue;

            for (const sanitizeFilter of sanitizeFilters) {
                sanitizedData = sanitizeFilter.filter(sanitizedData);
            }

            (<any>sanitizedFields)[schemaKey] = sanitizedData;
        }

        if (invalidFields.length > 0) return { valid: false, invalidFields, sanitizedFields };
        return { valid: true, invalidFields: [], sanitizedFields };
    }
}

export default Fields;