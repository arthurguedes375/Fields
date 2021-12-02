import { Filter, Repository } from "./Repos";

interface IFields {
    readonly defaultFilters: Filter[];
    readonly repository: Repository;
    readonly data: object;

    runFields(data: any, repo?: any, struct?: string): boolean | Array<string | object>;
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
    runFields(data?: any, repo?: Repository, struct?: string): boolean | Array<string | object> {
        repo = repo || this.repository;
        data = data || this.data;

        let missingFields: Array<string | object> = [];

        // Loop through all repo keys
        for (const repoKey in repo) {
            const repoValue = <Repository>repo[repoKey];

            // If the repoKey is another repo then it is going to validate the data using the repo inside that repoKey
            if (repoValue !== null && repoValue !== undefined && !repoValue?.filters && !repoValue.maxLength) {
                const valid = this.runFields(data[repoKey], repoValue, `${struct !== undefined ? `${struct}.` : ''}${repoKey}`)

                // If there was any error validating the data its going to add it to missingFields
                if (valid !== true) {
                    const missingFieldsValid = <Array<string | object>>valid;
                    missingFields = [
                        ...missingFields,
                        ...missingFieldsValid,
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
            const arrayWithTheMissingField = (arr: Array<string | object>, missingField: string, failMessage?: string) => {
                let array = [...arr];

                const field = `${struct !== undefined ? `${struct}.` : ''}${missingField}`;
                if (failMessage) {
                    array.push({
                        field,
                        message: failMessage,
                    })
                } else {
                    array.push(field);
                }

                return array;
            }


            // "dataValue" is the data with the same key as the current repoKey
            const dataValue = data[repoKey];

            if ((!dataValue && dataValue !== false) && (repoValue !== null && ((repoValue.filters?.length || 0) > 0 || repoValue.maxLength !== undefined || repoValue.required !== undefined) && (repoValue.required === true || repoValue.required === undefined))) {
                missingFields = arrayWithTheMissingField(
                    missingFields,
                    repoKey,
                    "This field is required and it must not be null or undefined"
                );
                continue;
            } else if (repoValue && repoValue.maxLength && Number.isInteger(repoValue.maxLength) && dataValue.length > repoValue.maxLength) {
                missingFields = arrayWithTheMissingField(
                    missingFields,
                    repoKey,
                    `The max length for this field is ${repoValue.maxLength} characters!`
                );
                continue;
            }

            for (const filter of (repoValue?.filters || [])) {
                const valid = filter.filter(dataValue);
                if (!valid) {
                    missingFields = arrayWithTheMissingField(
                        missingFields,
                        repoKey,
                        filter.failMessage,
                    );
                    break;
                }
            }
        }

        if (missingFields.length > 0) return missingFields;
        return true;
    }
}

export default Fields;