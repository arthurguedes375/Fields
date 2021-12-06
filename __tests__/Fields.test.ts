import { Factory } from '@src/index';
import { TestRepo } from './repos';

describe('Fields', () => {
    // TODO: Write tests to all possible cases 
    it('should return valid data', () => {
        const data1 = {
            notRequiredWithFilters: "abcde",
            notRequiredWithMaxLength: "ab",
            notRequiredWithMaxLengthAndFilters: "a",
            requiredWithNull: "a",
            requiredWithFilters: "abcde",
            requiredWithMaxLength: "ab",
            requiredWithMaxLengthAndFilters: "a",
        };
        const data2 = {
            requiredWithNull: "a",
            requiredWithFilters: "abcde",
            requiredWithMaxLength: "ab",
            requiredWithMaxLengthAndFilters: "a",
        };
        const Fields1 = Factory(TestRepo, data1).runFields();
        const Fields2 = Factory(TestRepo, data2).runFields();

        expect(Fields1).toBe(true);
        expect(Fields2).toBe(true);
    });
});