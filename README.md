# @arthurguedes375/fields-validator-repo

## About
This library validates data based on a Repository which is a Schema with the Filters and the structure expected from the data

## Examples
1. First one:
```typescript
import { Factory, Repository } from 'fields-validator-repo';

/*
    The repo is the expected Schema of the data
*/
/*
    The structure is something like:
*/

{
    name_of_the_field: null, // If it is set as null then it is only going to check if it is filled with some value
    name_of_the_field2: { // Setting required as true and setting the field as null like we did at "name_of_the_field" are the same thing
        required: true, 
    },

    /*
    null is the same thing as { required: true },
    */

    name_of_the_field3: {
        maxLength: 255, // Sets the max length for the field
    },

    // E-mail example
    email: {
        // Array of filters, each filter has a property called "filter" which is a function that receives the value of that field and returns "true" or "false", and each filter also has a property called "failMessage" which is the message that is going to be shown if the "filter" function returns "false"
        filters: [ 
            {
                filter: (email: string) => { // 
                    if(email == "abc") {
                        return true;
                    }else {
                        return false;
                    }
                },
                failMessage: "The e-mail is not valid because of...",
            },
            {
                filter: (email: string) => { // 
                    if(email != "def") {
                        return true;
                    }else {
                        return false;
                    }
                },
                failMessage: "The e-mail was not accepted because of...",
            }
        ],
        maxLength: 255, // Sets the max length for the e-mail
    },

    // You can also have a repo inside other repos
    address: {
        street: {
            name: {
                maxLength: 255,
            },
            number: {
                filters: [ 
                    {
                        filter: (number: number) => { // 
                            if(number > 300) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        failMessage: "The number is not valid because it is too big to be true :)",
                    },
                ],
                required: false, // If there is no value in the data then it is going to be ignored, but if there is a value and the filters don't return true then it is not going to be valid
            }
        },
        city: null,
        state: null,
    },
}


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
            email: {
                filters: [
                    {
                        filter: (email: string) => {
                            const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                            return regexEmail.test(String(email).toLowerCase());
                        },
                        failMessage: "Invalid e-mail",
                    }
                ],
                maxLength: 255,
            },
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
            email: {
                filters: [
                    {
                        filter: (email: string) => {
                            const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

                            return regexEmail.test(String(email).toLowerCase());
                        },
                        failMessage: "Invalid e-mail",
                    }
                ],
                maxLength: 255,
            },
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
    or if the user did not pass the "name" inside user it is going to return
    ['promocode', 'address', 'user.name']
    or if the user sent an unvalid e-mail it is going to return
    [
        'promocode',
        'address',
        'user.name',
        {
            field: 'user.email',
            message: 'Invalid e-mail',
        }
    ]
    But if the user did pass everything right 
    so it is going to return true
*/

const areFieldsValid = Fields.runFields();
if (areFieldsValid !== true) {
    console.log({
        message: 'Invalid Data',
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