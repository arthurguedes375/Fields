import { Repository } from "Repos";

export const TestRepo: Repository = {
    notRequiredWithFilters: {
        filters: [
            {
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