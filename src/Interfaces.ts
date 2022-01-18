export interface Filter {
    type: "validate" | "sanitize";
    filter: (data: any) => Promise<any> | any;
    failMessage?: string;
}

export interface Schema {
    filters?: Array<Filter>;
    maxLength?: number;
    required?: boolean;
    validationOnly?: boolean;
    [key: string]: Schema | Array<Filter> | number | boolean | undefined | null;
}