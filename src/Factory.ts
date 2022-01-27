import { Schema } from './Interfaces';
import Fields from './Fields';

interface IFactory<D> {
    readonly schema: Schema;
    readonly Fields: Fields<D>;
    readonly data: D;
}
export class Factory<D> implements IFactory<D> {
    Fields;
    constructor(
        readonly schema: Schema,
        readonly data: D,
    ) {
        this.Fields = new Fields(schema, data);
    }

    runFields() {
        return this.Fields.runFields();
    }
}

export function FieldsFactory<D>(schema: Schema, data: D) {
    return new Factory<D>(schema, data);
}