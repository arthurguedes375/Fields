// import {} from 'fields-validator-repo';
import { Fields, Repository } from './index';

// You can also create the instance by yourself(without using any factory(DO NOT RECOMMENDED))
const repo: Repository = {
    user: {
        name: null,
        email: null,
        id: null,
    },
    address: {
        street: {
            name: null,
            number: null
        },
        city: null,
        state: null,
    },
    promocode: null,
};


const data = {
    user: {
        name: "The user name",
        email: "example@email.com",
        id: 8218397213987,
    },
    address: {
        street: {
            name: "Abc...",
            number: 502,
        },
        city: "Some City",
        state: "Some State",
    },
    promocode: "50-promo-abc",
}




// If you do this anywhere that you want to test if the data are right you need to import the repository and create the instance and then run: .runFields()
const FieldsInstance = new Fields(repo, data);
const areFieldsValid = FieldsInstance.runFields();
if (areFieldsValid !== true) {
    console.log({
        message: 'It is missing data',
        missing: areFieldsValid,
    })
}