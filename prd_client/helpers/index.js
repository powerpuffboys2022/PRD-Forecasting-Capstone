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

export const statusToWord = ( status ) => {
    if(status === -1) return "cancelled"
    if(status === 1) return "pending request"
    if(status === 2) return "processing.."
    if(status === 3) return "shipped"
    if(status === 4) return "delivered"
    return "untracked"
}

export const getStatusColor = ( status ) => {
    if(status === -1) return "text-rose-600"
    if(status === 1) return "text-gray-700 animate-pulse duration-700"
    if(status === 2) return "text-yellow-500"
    if(status === 3) return "text-teal-700"
    if(status === 4) return "text-green-400"
    return "opacity-80"
}

export const beautifyMoney = ( amount, dec ) => {
    return (amount).toFixed(dec).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}