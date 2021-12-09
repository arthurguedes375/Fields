import { Filter, Repository } from "../Repos";

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
    readonly repository: Repository;
    readonly data: D;

    runFields(data: D, repo?: any, struct?: string): RunFieldsReturn<D>;
}

class Fields<D> implements IFields<D> {

    readonly defaultFilters: Filter[] = [];

    constructor(
        readonly repository: Repository,
        readonly data: D,
    ) { };

    /* 
        "data" is the data to be filtered
        "repo is the Filters and the information required to validate the data
        "struct" is the Structure of the current loop, so if some data is not allowed its gonna print out like: contact.address.street
    */
    runFields<D2 = D>(data?: D2 | D, repo?: Repository, struct?: string): RunFieldsReturn<D> {
        repo = repo || this.repository;
        data = data || this.data;

        for (const repoKey in repo) {
            if (repo[repoKey] === null) {
                repo[repoKey] = {
                    filters: [],
                    required: true,
                }
            }
        }

        let invalidFields: Array<InvalidField> = [];
        let sanitizedFields: D = <any>{};

        // Loop through all repo keys
        for (const repoKey in repo) {
            const repoValue = <Repository>repo[repoKey];

            // If the repoKey is another repo then it is going to validate the data using the repo inside that repoKey
            if (repoValue !== null && repoValue !== undefined && (repoValue.required !== true && repoValue.required !== false) && !repoValue.filters && !repoValue.maxLength) {
                const { valid, invalidFields: invalidFieldsReturned, sanitizedFields: sanitizedFieldsReturned } = this.runFields((<any>data)[repoKey], repoValue, `${struct !== undefined ? `${struct}.` : ''}${repoKey}`);
                (<any>sanitizedFields)[repoKey] = sanitizedFieldsReturned;
                // If there was any error validating the data its going to add it to invalidFields
                if (valid === false) {
                    invalidFields = [
                        ...invalidFields,
                        ...invalidFieldsReturned,
                    ];
                }
            }

            // Adding default filters
            repoValue.filters = [
                ...repoValue.filters || [],
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


            // "dataValue" is the data with the same key as the current repoKey
            const dataValue = (<any>data)[repoKey];


            //The data is invalid(null || undefined) and it is not false  // Making sure that the repoValue is a field and not another repo                                                      // The required is true
            if ((!dataValue && dataValue !== false) && ((repoValue.filters?.length || 0) > 0 || repoValue.maxLength !== undefined || repoValue.required !== undefined) && (repoValue.required === true || repoValue.required === undefined)) {
                // It gets here if the data is a nullish value and the field is set to null or if the field.required is set to true 
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    repoKey,
                    "This field is required and it must not be null or undefined"
                );
                continue;
            } else if (repoValue && repoValue.maxLength && Number.isInteger(repoValue.maxLength) && dataValue && dataValue.length > repoValue.maxLength) {
                invalidFields = arrayWithInvalidField(
                    invalidFields,
                    repoKey,
                    `The max length for this field is ${repoValue.maxLength} characters!`
                );
                continue;
            }

            const validateFilters = repoValue.filters.filter(filter => filter.type === "validate") || [];
            const sanitizeFilters = repoValue.filters.filter(filter => filter.type === "sanitize") || [];

            let validatedByFilters = true;

            for (const validateFilter of validateFilters) {
                const valid = validateFilter.filter(dataValue);
                if (dataValue === undefined || dataValue === null) break;
                if (!valid) {
                    invalidFields = arrayWithInvalidField(
                        invalidFields,
                        repoKey,
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

            (<any>sanitizedFields)[repoKey] = sanitizedData;
        }

        if (invalidFields.length > 0) return { valid: false, invalidFields, sanitizedFields };
        return { valid: true, invalidFields: [], sanitizedFields };
    }
}

export default Fields;