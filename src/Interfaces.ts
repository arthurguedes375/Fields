export interface Filter {
    type: "validate" | "sanitize";
    filter: (data: any) => any;
    failMessage?: string;
}

export interface Schema {
    filters?: Array<Filter>;
    maxLength?: number;
    required?: boolean;
    [key: string]: Schema | Array<Filter> | number | boolean | undefined | null;
}