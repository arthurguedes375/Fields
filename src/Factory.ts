import { Repository } from "./Repos";
import Fields from "./Fields";

interface IFactory<D> {
    readonly Repository: Repository;
    readonly Fields: Fields<D>;
    readonly data: D;
}
export class Factory<D> implements IFactory<D> {
    Fields;
    constructor(
        readonly Repository: Repository,
        readonly data: D,
    ) {
        this.Fields = new Fields(Repository, data);
    }

    runFields() {
        return this.Fields.runFields();
    }
}

export function FieldsFactory<D>(repo: Repository, data: D) {
    return new Factory<D>(repo, data);
}