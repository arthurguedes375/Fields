import { Filter, Schema } from './Interfaces';

interface InvalidField {
    field: string;
    message: string;
}

export interface RunFieldsReturn<D> {
    valid: boolean;
    invalidFields: Array<InvalidField>;
    sanitizedFields: D;
}

interface IFields<D> {
    readonly defaultFilters: Filter[];
    readonly schema: Schema;
    readonly data: D;

    runFields(data: D, schema?: any, struct?: string): Promise<RunFieldsReturn<D>>;
}

class Fields<D> implements IFields<D> {

    readonly defaultFilters: Filter[] = [];

    constructor(
        readonly schema: Schema,
        readonly data: D,
    ) { }

    /**
     * 
     * @param schema The value or schema to be checked
     * @returns True if the value is a schema or false if the value is not a schema.
     */
    isSchema(schema: Schema) {
        return (
            schema !== null && schema !== undefined &&
            (schema.required !== true && schema.required !== false)
            && (schema.validationOnly !== true && schema.validationOnly !== false)
            && !schema.filters
            && !schema.maxLength
        );
    }

    isRequired(schema: Schema) {
        return (schema.required === true || schema.required === undefined); 
    }

    hasMaxLength(schema: Schema) {
        return (
            schema &&
            schema.maxLength &&
            Number.isInteger(schema.maxLength)
        );
    }

    addLevelToStruct(fieldName: string, struct?: string) {
        return `${struct !== undefined ? `${struct}.` : ''}${fieldName}`;
    }


    /**
     *
     * @param data Data to be validated
     * @param schema The schema to validate the data
     * @param struct The depth of the current loop, it's used as prefix to reefer to the field.
     */
    async runFields<D2 = D>(data?: D2 | D, schema?: Schema, struct?: string): Promise<RunFieldsReturn<D>> {
        schema = schema || this.schema;
        data = data || this.data;

        // Sets default values if the schemaValue is null
        for (const schemaKey in schema) {
            if (schema[schemaKey] === null) {
                schema[schemaKey] = {
                    filters: [],
                    required: true,
                };
            }
        }

        /**
         * Array that contains the invalid fields along with their fail messages
         */
        let invalidFields: Array<InvalidField> = [];

        /**
         * Object that contains the sanitized and validated data
         */
        const sanitizedFields: D = <any>{};

        // Loop through all schema keys
        for (const schemaKey in schema) {
            const schemaValue = <Schema>schema[schemaKey];

            // If the schemaKey is another schema then it is going to validate the data using the schema inside that schemaKey
            if (this.isSchema(schemaValue)) {
                const {
                    valid,
                    invalidFields: invalidFieldsReturned,
                    sanitizedFields: sanitizedFieldsReturned,
                } = await this.runFields(
                    (<any>data)[schemaKey],
                    schemaValue,
                    this.addLevelToStruct(schemaKey, struct),
                );

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

            /**
             * 
             * @param arr Current invalid fields
             * @param invalidField Name of the field that is invalid
             * @param failMessage Fail message
             * @returns Array with the invalid field
             */
            const arrayWithInvalidField = (arr: Array<InvalidField>, invalidField: string, failMessage: string) => {
                const field = this.addLevelToStruct(invalidField, struct);

                arr.push({
                    field,
                    message: failMessage,
                });

                return arr;
            };

            /**
             * Is the data with the same key as the current schemaKey
             */
            const dataValue = (<any>data)[schemaKey];

            if (
                //The data is invalid(null || undefined) and it is not false
                (!dataValue && dataValue !== false) &&

                // Making sure that the schemaValue is a field and not another schema
                !this.isSchema(schemaValue) &&
                
                // The required is true
                this.isRequired(schemaValue)
            ) {
                // It gets here if the data is a nullish value and the field is required
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    schemaKey,
                    'This field is required and it must not be null or undefined',
                );
                continue;
            } else if (
                this.hasMaxLength(schemaValue) &&
                dataValue &&
                dataValue.length > (<any>schemaValue).maxLength
            ) {
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    schemaKey,
                    `The max length for this field is ${schemaValue.maxLength} characters!`,
                );
                continue;
            }

            // If the data is a nullish value and it's not required
            if ((!dataValue && dataValue !== false) && schemaValue.required === false) continue;

            const validateFilters = schemaValue.filters.filter(filter => filter.type === 'validate') || [];
            const sanitizeFilters = schemaValue.filters.filter(filter => filter.type === 'sanitize') || [];

            let validatedByFilters = true;

            for (const validateFilter of validateFilters) {
                const valid = await validateFilter.filter(dataValue);
                if (!valid) {
                    invalidFields = arrayWithInvalidField(
                        invalidFields,
                        schemaKey,
                        (<any>validateFilter).failMessage || '',
                    );
                    validatedByFilters = false;
                    break;
                }
            }

            if (!validatedByFilters || schemaValue.validationOnly) continue;

            let sanitizedData = dataValue;

            for (const sanitizeFilter of sanitizeFilters) {
                sanitizedData = await sanitizeFilter.filter(sanitizedData);
            }

            (<any>sanitizedFields)[schemaKey] = sanitizedData;
        }

        if (invalidFields.length > 0) return { valid: false, invalidFields, sanitizedFields };
        return { valid: true, invalidFields: [], sanitizedFields };
    }
}

export default Fields;