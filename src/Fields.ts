import { Filter, Repository } from "../Repos";

interface InvalidField {
    field: string;
    message: string;
};

export interface RunFieldsReturn {
    valid: boolean;
    invalidFields: Array<InvalidField>;
}

interface IFields {
    readonly defaultFilters: Filter[];
    readonly repository: Repository;
    readonly data: object;

    runFields(data: any, repo?: any, struct?: string): RunFieldsReturn;
}

class Fields implements IFields {

    readonly defaultFilters: Filter[] = [];

    constructor(
        readonly repository: Repository,
        readonly data: object,
    ) { };

    /* 
        "data" is the data to be filtered
        "repo is the Filters and the information required to validate the data
        "struct" is the Structure of the current loop, so if some data is not allowed its gonna print out like: contact.address.street
    */
    runFields(data?: any, repo?: Repository, struct?: string): RunFieldsReturn {
        repo = repo || this.repository;
        data = data || this.data;

        let invalidFields: Array<InvalidField> = [];

        // Loop through all repo keys
        for (const repoKey in repo) {
            const repoValue = <Repository>repo[repoKey];

            // If the repoKey is another repo then it is going to validate the data using the repo inside that repoKey
            if (repoValue !== null && repoValue !== undefined && !repoValue?.filters && !repoValue.maxLength) {
                const { valid, invalidFields: invalidFieldsReturned } = this.runFields(data[repoKey], repoValue, `${struct !== undefined ? `${struct}.` : ''}${repoKey}`)

                // If there was any error validating the data its going to add it to missingFields
                if (valid === false) {
                    invalidFields = [
                        ...invalidFields,
                        ...invalidFieldsReturned,
                    ];
                }
            }


            if (repoValue !== null) {
                // Adding default filters
                repoValue.filters = [
                    ...repoValue.filters || [],
                    ...this.defaultFilters,
                ];
            }

            // "arr" is the current missing fields
            const arrayWithTheMissingField = (arr: Array<InvalidField>, missingField: string, failMessage: string) => {
                let array = [...arr];

                const field = `${struct !== undefined ? `${struct}.` : ''}${missingField}`;

                array.push({
                    field,
                    message: failMessage,
                })

                return array;
            }


            // "dataValue" is the data with the same key as the current repoKey
            const dataValue = data[repoKey];


            //The data is invalid(null || undefined) and it is not false  // Making sure that the repoValue is a field and not another repo                                                      // The required is true
            if ((!dataValue && dataValue !== false) && (repoValue === null || (repoValue !== null && ((repoValue.filters?.length || 0) > 0 || repoValue.maxLength !== undefined || repoValue.required !== undefined) && (repoValue.required === true || repoValue.required === undefined)))) {
                // It gets here if the data is a nullish value and the field is set to null or if the field.required is set to true 
                invalidFields = arrayWithTheMissingField(
                    invalidFields,
                    repoKey,
                    "This field is required and it must not be null or undefined"
                );
                continue;
            } else if (repoValue && repoValue.maxLength && Number.isInteger(repoValue.maxLength) && dataValue && dataValue.length > repoValue.maxLength) {
                invalidFields = arrayWithTheMissingField(
                    invalidFields,
                    repoKey,
                    `The max length for this field is ${repoValue.maxLength} characters!`
                );
                continue;
            }

            for (const filter of (repoValue?.filters || [])) {
                const valid = filter.filter(dataValue);
                if (dataValue === undefined || dataValue === null) break;
                if (!valid) {
                    invalidFields = arrayWithTheMissingField(
                        invalidFields,
                        repoKey,
                        filter.failMessage,
                    );
                    break;
                }
            }
        }

        if (invalidFields.length > 0) return { valid: false, invalidFields };
        return { valid: true, invalidFields: [] };
    }
}

export default Fields;