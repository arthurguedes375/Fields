export interface Filter {
    /**
     * Defines the type of the filter.
     */
    type: "validate" | "sanitize";

    /**
     * Filter function,
     * If the type of the filter was set to "validate" then this function must return a boolean that indicates whether the data is valid or not
     * If the type of the filter was set to "sanitize" then this function must return the sanitized data.
     */
    filter: (data: any) => Promise<any> | any;

    /**
     * You only need to set this if the type of the filter was set to "validate",
     * If the filter function returns false then this message should contain the reason for the data to be considered invalid
     * the failMessage will be returned inside the invalidFields
     */
    failMessage?: string;
}

export interface Schema {
    /**
     * The default value is: ```[]```
     * It's an array of filters.
     */
    filters?: Array<Filter>;

    /**
     * Sets the max length for the received string,
     */
    maxLength?: number;

    /**
     * The default value is: true
     * If it's set to true then it's not going to allow nullish values like: null or undefined or ""
     */
    required?: boolean;

    /**
     * The default value is: false
     * If true the field is not going to be added to the sanitizedFields.
     * The field is going to be validated but it is not going to be in the output.
     */
    validationOnly?: boolean;

    [key: string]: Schema | Array<Filter> | number | boolean | undefined | null;
}