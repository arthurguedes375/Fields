import { Repository } from "./Repos";

interface IFields {
    readonly repository: Repository;
    readonly data: object;

    runFields(data: any, repo?: any): boolean | string[];
}

class Fields implements IFields {

    constructor(
        readonly repository: Repository,
        readonly data: object,
    ) { };

    /*
        repository = {
            address: {
                street: {
                    name: null,
                    number: null,
                },
                city: null,
                state: null,
            },
            contact: {
                email: null,
                name: null,
            },
            cart: null,
        }

    */

    runFields(data?: any, repo?: any): boolean | string[] {
        repo = repo || this.repository;
        data = data || this.data;

        let missingFields: string[] = [];
        for (const repoKey in repo) {
            if (repo[repoKey] !== null && repo[repoKey] !== undefined) {
                const valid = this.runFields(data[repoKey], repo[repoKey])

                if (valid !== true) {
                    const missingFieldsValid = <string[]>valid;
                    missingFields = [
                        ...missingFields,
                        ...missingFieldsValid,
                    ];
                }
            }

            const dataValue = data[repoKey];
            if (!dataValue) {
                missingFields.push(repoKey);
            }
        }

        if (missingFields.length > 0) return missingFields;
        return true;
    }
}

export default Fields;