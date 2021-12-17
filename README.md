# @arthurguedes375/fields-validator-repo

## About
This library validates data based on a Schema with the Filters and the structure expected from the data

## Tips :bulb:
A good way to see how it actually works is reading the tests.


# Documentation:

## Schema:
The Schema follows a pattern, first you set the field name, then you set it as null if you want it to be required or set it as an object which can be either another schema or it could be the settings for that field.

So for example, if you expect to receive a object with the property called "name" and you don't want it to have any nullish value then the schema is going to be:
```javascript
// Both are the same
{
    name: null
}
// Or
{
    name: {
        required: true
    }
}
/* Setting the field as null is the same as setting it as an object with only the "required: true" property*/
```

If you want to allow nullish values like(```null``` or ```undefined``` or ```""```) you can set the ```required``` to ```false```. The schema would be:
```javascript
{
    name: {
        required: false
    }
}
```

## Field properties:
- ```required```
- ```maxLength```
- ```filters```
---
### Property: ```required```
The default value is: ```true```

If it's set to true then it's not going to allow nullish values like: ```null``` or ```undefined``` or ```""```

---
### Property: ```maxLength```
Sets the max length for the received ```string```

---
### Property: ```filters```
The default value is: ```[]```

It's an array of filters, later on in this tutorial you'll learn how to create your own filters.

## Filters
A filter can be either a ```validate``` filter or a ```sanitize``` filter.
A filter is an object with this properties:
- ```type```: Can be either ```"validate"``` or ```"sanitize"```
- ```filter```: It is a function, and based on the filter type it returns either a sanitized data or a boolean that indicates if the data is valid or not
- ```failMessage```: It is the message that is going to be returned if the filter function returns ```false```, it can only be used if the filter type is ```"validate"```

First it runs all validate filters, if all of them return ```true```(that means that the data was successfully validated and that the data is valid) only then it runs all sanitize filters, if there are more than one sanitize filter then it passes the returned data from one filter to the next one and so on.

---
### Validate Filter
A validate filter looks like:
```javascript
{
    type: "validate",
    filter: (data: any) => {
        if (data == "a") return true;
        return false;
    },
    failMessage: "Content is not equal to \"a\""
}
```
The property called ```filter``` is a function that receives the data and returns either ```true``` or ```false```, if it returns ```true``` then the data will be considered valid, but if it returns ```false``` then the data will be considered invalid, and the ```failMessage``` will be returned to the user, the data can be anything, it could be an ```array``` or a ```string``` or a ```number``` or any kind of data.

The property called ```failMessage``` is the message that is returned to the user, it usually is the reason for the field be considered invalid.

---
### Sanitize Filter
The property called ```filter``` is a function that receives the ```data``` which could be of any kind, and it returns the sanitized data, in the next example it gets a ```string``` and it removes all white spaces, then it returns the ```string``` without any white space.

A sanitize filter looks like:
```javascript
{
    type: "sanitize",
    filter: (data: any) => {
        return data.replace(/\s/g, '');
    }
}
```


<p align="center">Made with :heart: by <strong>Arthur Guedes</strong></p>