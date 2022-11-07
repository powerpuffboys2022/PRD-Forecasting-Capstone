var validator = require("email-validator");

export const Validator = (val, validations, minLength, maxLength) => {
    let res = true;

    if(!minLength) minLength = 0;
    if(!maxLength) maxLength = 0;
    
    for(var x = 0; x < validations.length; x++){
        if(validations[x] === 'isEmpty') if(isEmpty(val)) return false;
        if(validations[x] === 'isEmail') if(!validator.validate(val)) return false;
        if(validations[x] === 'isNotNumber') if(isNotNumber(val)) return false;
        if(validations[x] === 'min') if(val.length < minLength) return false
        if(validations[x] === 'max') if(val.length > maxLength) return false
    }

    return res;
}
export const isEmpty = (val) => !val || val.length === 0
export const isNotNumber = (val) => isNaN(val) || isNaN(parseFloat(val))