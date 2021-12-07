import { Factory } from '@src/index';
import { TestRepo } from './repos';

describe('Fields', () => {
    it('should return valid data', () => {
        const generateData = (notRequiredWithFilters?: string, notRequiredWithMaxLength?: string, notRequiredWithMaxLengthAndFilters?: string) => ({
            notRequiredWithFilters: "abcde",
            notRequiredWithMaxLength: "ab",
            notRequiredWithMaxLengthAndFilters: "a",
            requiredWithNull: "a",
            requiredWithFilters: "abcde",
            requiredWithMaxLength: "ab",
            requiredWithMaxLengthAndFilters: "a",
        });

        const data1 = generateData("abcde", "ab", "a");
        const data2 = generateData();

        const Fields1 = Factory(TestRepo, data1).runFields();
        const Fields2 = Factory(TestRepo, data2).runFields();

        expect(Fields1).toBe(true); // expect(Fields1.valid).toBe(true);
        expect(Fields2).toBe(true);
    });
    it('should return invalid data for the notRequired with filters, maxLength, maxLength and Filters', () => {
        const generateData = (notRequiredWithFilters: string, notRequiredWithMaxLength: string, notRequiredWithMaxLengthAndFilters: string) => ({
            notRequiredWithFilters,
            notRequiredWithMaxLength,
            notRequiredWithMaxLengthAndFilters,
            requiredWithNull: "a",
            requiredWithFilters: "abcde",
            requiredWithMaxLength: "ab",
            requiredWithMaxLengthAndFilters: "a",
        });

        const data1 = generateData("abcd", "abc", "abc");
        const data2 = generateData("abcd", "abc", "ab");

        const Fields1 = Factory(TestRepo, data1).runFields();
        const Fields2 = Factory(TestRepo, data2).runFields();

        expect(Fields1).toEqual([
            {
                field: 'notRequiredWithFilters',
                message: 'Content is not equal to "abcde"'
            },
            {
                field: 'notRequiredWithMaxLength',
                message: 'The max length for this field is 2 characters!'
            },
            {
                field: 'notRequiredWithMaxLengthAndFilters',
                message: 'The max length for this field is 2 characters!'
            }
        ]);
        expect(Fields2).toEqual([
            {
                field: 'notRequiredWithFilters',
                message: 'Content is not equal to "abcde"'
            },
            {
                field: 'notRequiredWithMaxLength',
                message: 'The max length for this field is 2 characters!'
            },
            {
                field: 'notRequiredWithMaxLengthAndFilters',
                message: 'Content is not equal to "a"'
            }
        ]);
    });
    it('should return invalid data for the required with null, filters, maxLength, maxLength and filters', () => {
        const generateData = (value: null | undefined | "", requiredWithFilters?: string, requiredWithMaxLength?: string, requiredWithMaxLengthAndFilters?: string) => ({
            requiredWithNull: value,
            requiredWithFilters: (requiredWithFilters !== undefined) ? requiredWithFilters : value,
            requiredWithMaxLength: (requiredWithMaxLength !== undefined) ? requiredWithMaxLength : value,
            requiredWithMaxLengthAndFilters: (requiredWithMaxLengthAndFilters !== undefined) ? requiredWithMaxLengthAndFilters : value,
        });

        const data1 = [generateData(null), generateData(undefined), generateData("")];
        const data2 = [generateData(null, "abcd", "abc", "abc"), generateData(null, "abcd", "abc", "ab")];

        data1.forEach(data => {
            const Fields = Factory(TestRepo, data).runFields();
            expect(Fields).toEqual([
                {
                    field: 'requiredWithNull',
                    message: 'This field is required and it must not be null or undefined'
                },
                {
                    field: 'requiredWithFilters',
                    message: 'This field is required and it must not be null or undefined'
                },
                {
                    field: 'requiredWithMaxLength',
                    message: 'This field is required and it must not be null or undefined'
                },
                {
                    field: 'requiredWithMaxLengthAndFilters',
                    message: 'This field is required and it must not be null or undefined'
                }
            ])
        })

        const Fields2 = [
            Factory(TestRepo, data2[0]).runFields(),
            Factory(TestRepo, data2[1]).runFields(),
        ];

        expect(Fields2[0]).toEqual([
            {
                field: 'requiredWithNull',
                message: 'This field is required and it must not be null or undefined'
            },
            {
                field: 'requiredWithFilters',
                message: 'Content is not equal to "abcde"'
            },
            {
                field: 'requiredWithMaxLength',
                message: 'The max length for this field is 2 characters!'
            },
            {
                field: 'requiredWithMaxLengthAndFilters',
                message: 'The max length for this field is 2 characters!'
            }
        ]);

        expect(Fields2[1]).toEqual([
            {
                field: 'requiredWithNull',
                message: 'This field is required and it must not be null or undefined'
            },
            {
                field: 'requiredWithFilters',
                message: 'Content is not equal to "abcde"'
            },
            {
                field: 'requiredWithMaxLength',
                message: 'The max length for this field is 2 characters!'
            },
            {
                field: 'requiredWithMaxLengthAndFilters',
                message: 'Content is not equal to "a"'
            }
        ]);
    });
});