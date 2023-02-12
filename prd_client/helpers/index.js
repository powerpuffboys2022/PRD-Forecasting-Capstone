var validator = require("email-validator");
var moment = require("moment");

import { MdPendingActions, MdLocalShipping } from "react-icons/md";
import { TbTruckLoading } from "react-icons/tb";
import { AiOutlineFileDone, AiOutlineStop } from "react-icons/ai";

export const Validator = (val, validations, minLength, maxLength, expected) => {
  let res = true;

  if (!minLength) minLength = 0;
  if (!maxLength) maxLength = 0;

  for (var x = 0; x < validations.length; x++) {
    if (validations[x] === "isEmpty") if (isEmpty(val)) return false;
    if (validations[x] === "isEmail")
      if (!validator.validate(val)) return false;
    if (validations[x] === "isNotNumber") if (isNotNumber(val)) return false;
    if (validations[x] === "min") if (val.length < minLength) return false;
    if (validations[x] === "max") if (val.length > maxLength) return false;
    if (validations[x] === "equals") if (!equals(val, expected)) return;
  }

  return res;
};

export const isEmpty = (val) => !val || val.length === 0;

export const isNotNumber = (val) => isNaN(val) || isNaN(parseFloat(val));

export const equals = (val, compare) => val === compare;

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

export const statusToWord = (status) => {
  if (status === -1) return "canceled";
  if (status === 1) return "pending request";
  if (status === 2) return "processing..";
  if (status === 3) return "shipped";
  if (status === 4) return "delivered";
  return "untracked";
};

export const statusToComponentWord = (status) => {
  if (status === -1) return <span>canceled</span>;
  if (status === 1) return <span>pending request</span>;
  if (status === 2) return <span>processing..</span>;
  if (status === 3) return <span>shipped</span>;
  if (status === 4) return <span>delivered</span>;
  return "untracked";
};

export const getStatusColor = (status) => {
  if (status === -1) return "text-rose-600";
  if (status === 1) return "text-gray-700 animate-pulse duration-700";
  if (status === 2) return "text-yellow-500";
  if (status === 3) return "text-teal-700";
  if (status === 4) return "text-green-600";
  return "opacity-80";
};

export const beautifyMoney = (amount, dec) => {
  return amount.toFixed(dec).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export const getDateAgo = (current, given) => {
  let a = moment(current);
  let b = moment(given);

  return a.diff(b, "days");
};

export const getCustomAgo = (current, given, measurement) => {
  let a = moment(current);
  let b = moment(given);
  return a.diff(b, measurement);
};

export const getago = (a, b) => {
    var val = getCustomAgo(a,b,"seconds")
    var finalResult = `${val} seconds`
    var units = 'seconds'
    // min
    if(val >= 60 && units==='seconds') { val = getCustomAgo(a, b, "minutes"); finalResult = `${val} minutes ago`}

    if(val >= 60 && units ==='minutes' ) { val = getCustomAgo(a, b, "hours"); finalResult = `${val} hours ago`}

    if(val >= 24 && units ==='hours') { val = getCustomAgo(a, b, "days"); finalResult = `${val} days ago`}

    if(val >= 7 && units ==='days') { val = getCustomAgo(a, b, "weeks"); finalResult = `${val} weeks ago`}

    if(val >= 4 && units ==='weeks') { val = getCustomAgo(a, b, "months"); finalResult = `${val} months ago`}

    if(val >= 12 && units ==='months') { val = getCustomAgo(a, b, "years"); finalResult = `${val} years ago`}

    return { val, finalResult }
}


export const dateMomentBeautify = (date, format) => {
  //"MMMM Do YYYY, h:mm a"
  return moment(date).format(format);
};

export const scanVals = (obj, what, skips) => {
  for (const prop in obj) {
    const toCheck = `${obj[prop]}`.toLowerCase();
    if (`${skips.join()}`.includes(prop)) continue;
    if (prop === "_id" && what.length !== obj[prop].length) continue;
    if (toCheck.includes(what.toLowerCase()) || toCheck == what.toLowerCase())
      return true;
  }
  return false;
};
