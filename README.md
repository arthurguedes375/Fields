# @arthurguedes375/fields-validator-repo

## About
This is a project for who wants to validate the data of anything before storing it in your database

## Examples
1. First one:
```typescript
import { Factory, Repository } from 'fields-validator-repo';

/*
    The repo is the fields that
    are necessary
*/
/*
    You set the name of the field
    and then set it as null
    if the field is necessary
*/

/* In this example the
right data structure is: 

    {
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

    The next repository makes that data
    structure: 

    {
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
    }

*/

/*
    The BuyFields returns a
    Fields Object already setted the
    repo so you just need to run the
    validation(running thefunction
    .runFields())
*/
/*
    You should create a file and put only the
    BuyFields with the imports and export it 
    like: export const BuyFields = (data: 
    object) => {...}
*/
/*
    And in another file use it to return the 
    Fields Object(the BuyFields use a factory 
    to return the Fields Object)
*/
const BuyFields = (data: object) => {
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

    return Factory(repo, data);
}

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

/*
    This is the Fields Object already
    setted the repository
*/
/*
    Note that this one you do not need to 
    pass the repository anytime that you want 
    to check if the data is right because the 
    factory already created a instance with 
    the repository
*/
    const Fields = BuyFields(data);

// ---------

/*
    The next function(Fields.runFields()) 
    returns true if the data is right or 
    returns an array with the name of the 
    fields that is missing
*/

/*
    Example, if the user did not pass the 
    promocode it is going to return 
    ['promocode'] or if the user did not pass 
    the promocode and the address it is going 
    to return ['promocode', 'address']
    But if the user did pass everything right 
    so it is going to return true
*/

const areFieldsValid = Fields.runFields();
if (areFieldsValid !== true) {
    console.log({
        message: 'It is missing data',
        missing: areFieldsValid,
    })
}

```


2. Second one:
```typescript
import { Fields, Repository } from 'fields-validator-repo';

/*
    You can also create the instance by 
    yourself(without using any factory, I DO 
    NOT RECOMMEND)
*/
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



/*
    If you do this anywhere that you want to 
    test if the data is right you need to 
    import the repository and create the 
    instance and then run: .runFields()
*/
/*
    The return of this function is the same 
    as the previous one(With the factory)
*/
const FieldsInstance = new Fields(repo, data);
const areFieldsValid = FieldsInstance.runFields();
if (areFieldsValid !== true) {
    console.log({
        message: 'It is missing data',
        missing: areFieldsValid,
    })
}

```


<p align="center">Made with :heart: by <strong>Arthur Guedes</strong></p>