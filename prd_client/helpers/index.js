var validator = require("email-validator");

export const Validator = (val, validations, minLength, maxLength, expected) => {
    let res = true;

    if(!minLength) minLength = 0;
    if(!maxLength) maxLength = 0;
    
    for(var x = 0; x < validations.length; x++){
        if(validations[x] === 'isEmpty') if(isEmpty(val)) return false;
        if(validations[x] === 'isEmail') if(!validator.validate(val)) return false;
        if(validations[x] === 'isNotNumber') if(isNotNumber(val)) return false;
        if(validations[x] === 'min') if(val.length < minLength) return false
        if(validations[x] === 'max') if(val.length > maxLength) return false
        if(validations[x] === 'equals') if(!equals(val, expected)) return 
    }

    return res;
}

export const isEmpty = (val) => !val || val.length === 0

export const isNotNumber = (val) => isNaN(val) || isNaN(parseFloat(val))

export const equals = (val, compare) => val === compare

export const dateToBeutify = (date) => {
    let thisDate = new Date(date);
    let wordDate = `${thisDate.toLocaleString("en-us", {
      month: "short",
    })} ${thisDate.getDate()}, ${thisDate.getFullYear()} at ${thisDate.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
    return wordDate;
  };