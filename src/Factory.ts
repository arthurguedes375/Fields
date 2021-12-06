import { Repository } from "../Repos";
import Fields from "./Fields";

interface IFactory {
    readonly Repository: Repository;
    readonly Fields: Fields;
    readonly data: object;
}
export class Factory implements IFactory {
    Fields;
    constructor(
        readonly Repository: Repository,
        readonly data: object,
    ) {
        this.Fields = new Fields(Repository, data);
    }

    runFields() {
        return this.Fields.runFields();
    }
}

export const FieldsFactory = (repo: Repository, data: object) => new Factory(repo, data);