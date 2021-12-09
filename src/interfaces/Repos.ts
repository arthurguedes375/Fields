export interface Filter {
    type: "validate" | "sanitize";
    filter: (data: any) => any;
    failMessage?: string;
}

export interface Repository {
    filters?: Array<Filter>;
    maxLength?: number;
    required?: boolean;
    [key: string]: Repository | Array<Filter> | number | boolean | undefined | null;
}