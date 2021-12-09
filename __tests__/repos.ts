import { Repository } from "@interfaces/Repos";

export const ValidateTestRepo: Repository = {
    notRequiredWithFilters: {
        filters: [
            {
                type: "validate",
                filter: (data: string) => {
                    if (data == "abcde") return true;
                    return false;
                },
                failMessage: "Content is not equal to \"abcde\""
            }
        ],
        required: false,
    },
    notRequiredWithMaxLength: {
        maxLength: 2,
        required: false,
    },
    notRequiredWithMaxLengthAndFilters: {
        filters: [
            {
                type: "validate",
                filter: (data: string) => {
                    if (data == "a") return true;
                    return false;
                },
                failMessage: "Content is not equal to \"a\""
            }
        ],
        maxLength: 2,
        required: false,
    },
    requiredWithNull: null,
    requiredWithFilters: {
        filters: [
            {
                type: "validate",
                filter: (data: string) => {
                    if (data == "abcde") return true;
                    return false;
                },
                failMessage: "Content is not equal to \"abcde\""
            }
        ],
        required: true,
    },
    requiredWithMaxLength: {
        maxLength: 2,
        required: true,
    },
    requiredWithMaxLengthAndFilters: {
        filters: [
            {
                type: "validate",
                filter: (data: string) => {
                    if (data == "a") return true;
                    return false;
                },
                failMessage: "Content is not equal to \"a\""
            }
        ],
        maxLength: 2,
        required: true,
    },
};

export const SanitizeTestRepo: Repository = {
    removingSpaces: {
        filters: [
            {
                type: "validate",
                filter: (data: any) => {
                    return data.includes(" ");
                },
                failMessage: "There is no space",
            },
            {
                type: "sanitize",
                filter: (data: any) => {
                    return data.replace(/\s/g, '');
                }
            },
            {
                type: "sanitize",
                filter: (data: any) => {
                    return `.   .${data}.   .`;
                }
            }
        ],
        required: true,
    }
};