import { Factory } from '@src/index';
import { SanitizeTestSchema, ValidateTestSchema } from './schemas';

describe('Fields: Validate', () => {
    it('should return valid data', async () => {
        const generateData = (notRequiredWithFilters?: string, notRequiredWithMaxLength?: string, notRequiredWithMaxLengthAndFilters?: string) => ({
            notRequiredWithFilters,
            notRequiredWithMaxLength,
            notRequiredWithMaxLengthAndFilters,
            requiredWithValidationOnly: 'abc',
            requiredWithNull: 'a',
            requiredWithFilters: 'abcde',
            requiredWithMaxLength: 'ab',
            requiredWithMaxLengthAndFilters: 'a',
        });

        const data1 = generateData('abcde', 'ab', 'a');
        const data2 = generateData();

        const Fields1 = await Factory(ValidateTestSchema, data1).runFields();
        const Fields2 = await Factory(ValidateTestSchema, data2).runFields();

        expect(Fields1.valid).toBe(true);
        expect(Fields2.valid).toBe(true);

        expect(Fields1.invalidFields).toHaveLength(0);
        expect(Fields2.invalidFields).toHaveLength(0);
        expect(Fields2.sanitizedFields.requiredWithValidationOnly).toBeUndefined();
    });
    it('should return invalid data for the notRequired with filters, maxLength, maxLength and Filters', async () => {
        const generateData = (notRequiredWithFilters: string, notRequiredWithMaxLength: string, notRequiredWithMaxLengthAndFilters: string) => ({
            notRequiredWithFilters,
            notRequiredWithMaxLength,
            notRequiredWithMaxLengthAndFilters,
            requiredWithValidationOnly: 'abc',
            requiredWithNull: 'a',
            requiredWithFilters: 'abcde',
            requiredWithMaxLength: 'ab',
            requiredWithMaxLengthAndFilters: 'a',
        });

        const data1 = generateData('abcd', 'abc', 'abc');
        const data2 = generateData('abcd', 'abc', 'ab');

        const Fields1 = await Factory(ValidateTestSchema, data1).runFields();
        const Fields2 = await Factory(ValidateTestSchema, data2).runFields();

        expect(Fields1.valid).toBe(false);
        expect(Fields2.valid).toBe(false);

        expect(Fields1.invalidFields).toEqual([
            {
                field: 'notRequiredWithFilters',
                message: 'Content is not equal to "abcde"',
            },
            {
                field: 'notRequiredWithMaxLength',
                message: 'The max length for this field is 2 characters!',
            },
            {
                field: 'notRequiredWithMaxLengthAndFilters',
                message: 'The max length for this field is 2 characters!',
            },
        ]);
        expect(Fields2.invalidFields).toEqual([
            {
                field: 'notRequiredWithFilters',
                message: 'Content is not equal to "abcde"',
            },
            {
                field: 'notRequiredWithMaxLength',
                message: 'The max length for this field is 2 characters!',
            },
            {
                field: 'notRequiredWithMaxLengthAndFilters',
                message: 'Content is not equal to "a"',
            },
        ]);
    });
    it('should return invalid data for the required with null, filters, maxLength, maxLength and filters', async () => {
        const generateData = (value: null | undefined | '', requiredWithFilters?: string, requiredWithMaxLength?: string, requiredWithMaxLengthAndFilters?: string, requiredWithValidationOnly?: string) => ({
            requiredWithValidationOnly: (requiredWithValidationOnly !== undefined) ? requiredWithValidationOnly : value,
            requiredWithNull: value,
            requiredWithFilters: (requiredWithFilters !== undefined) ? requiredWithFilters : value,
            requiredWithMaxLength: (requiredWithMaxLength !== undefined) ? requiredWithMaxLength : value,
            requiredWithMaxLengthAndFilters: (requiredWithMaxLengthAndFilters !== undefined) ? requiredWithMaxLengthAndFilters : value,
        });

        const data1 = [generateData(null), generateData(undefined), generateData('')];
        const data2 = [generateData(null, 'abcd', 'abc', 'abc', 'aaaaa'), generateData(null, 'abcd', 'abc', 'ab')];

        data1.forEach(async (data) => {
            const Fields = await Factory(ValidateTestSchema, data).runFields();
            expect(Fields.valid).toBe(false);
            expect(Fields.invalidFields).toEqual([
                {
                    field: 'requiredWithValidationOnly',
                    message: 'This field is required and it must not be null or undefined',
                },
                {
                    field: 'requiredWithNull',
                    message: 'This field is required and it must not be null or undefined',
                },
                {
                    field: 'requiredWithFilters',
                    message: 'This field is required and it must not be null or undefined',
                },
                {
                    field: 'requiredWithMaxLength',
                    message: 'This field is required and it must not be null or undefined',
                },
                {
                    field: 'requiredWithMaxLengthAndFilters',
                    message: 'This field is required and it must not be null or undefined',
                },
            ]);
        });

        const Fields2 = [
            await Factory(ValidateTestSchema, data2[0]).runFields(),
            await Factory(ValidateTestSchema, data2[1]).runFields(),
        ];

        expect(Fields2[0].valid).toBe(false);
        expect(Fields2[1].valid).toBe(false);
        
        expect(Fields2[0].invalidFields).toEqual([
            {
                field: 'requiredWithValidationOnly',
                message: 'Content is not equal to "abc"',
            },
            {
                field: 'requiredWithNull',
                message: 'This field is required and it must not be null or undefined',
            },
            {
                field: 'requiredWithFilters',
                message: 'Content is not equal to "abcde"',
            },
            {
                field: 'requiredWithMaxLength',
                message: 'The max length for this field is 2 characters!',
            },
            {
                field: 'requiredWithMaxLengthAndFilters',
                message: 'The max length for this field is 2 characters!',
            },
        ]);

        expect(Fields2[1].invalidFields).toEqual([
            {
                field: 'requiredWithValidationOnly',
                message: 'This field is required and it must not be null or undefined',
            },
            {
                field: 'requiredWithNull',
                message: 'This field is required and it must not be null or undefined',
            },
            {
                field: 'requiredWithFilters',
                message: 'Content is not equal to "abcde"',
            },
            {
                field: 'requiredWithMaxLength',
                message: 'The max length for this field is 2 characters!',
            },
            {
                field: 'requiredWithMaxLengthAndFilters',
                message: 'Content is not equal to "a"',
            },
        ]);
    });
});

describe('Fields: Sanitize', () => {
    it('should only sanitize the data if it has been validated', async () => {
        const generateData = (removingSpaces: string) => ({ removingSpaces });

        const Fields = [
            await Factory(SanitizeTestSchema, generateData('abc')).runFields(),
            await Factory(SanitizeTestSchema, generateData('ab c')).runFields(),
        ];

        expect(Fields[0].valid).toBe(false);
        expect(Fields[0].invalidFields).toEqual([
            {
                field: 'removingSpaces',
                message: 'There is no space',
            },
        ]);
        expect(Fields[0].sanitizedFields.removingSpaces).toBe(undefined);

        expect(Fields[1].valid).toBe(true);
        expect(Fields[1].invalidFields).toEqual([]);
        expect(Fields[1].sanitizedFields.removingSpaces).toBe('.   .abc.   .');
    });
});