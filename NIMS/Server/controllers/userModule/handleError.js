"use strict";

const handleErrors = (err) => {
  // err.message and err.codes

  let errors = {
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    phone: "",
    dept: "",
    desg: "",
    password: "",
    dept: "",
    desg: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal: "",
    doj: "",
    gender: "",
    "govId.image": "",
    departmentName: "",
    designationName: "",
    departmentCode: "",
    confirmpassword: "",
  };

  if (err.code === "FILE_EXTENSION_ERROR") {
    console.log("Ext");
    if (err.fieldname === "govId") {
      errors["govId.image"] = err.message;
    } else if (err.fieldname === "profilePic") {
      errors["profilePic"] = err.message;
    }
  }

  if (err.code === "PASSWORD_MISMATCH_ERROR") {
    errors["confirmpassword"] = err.message;
  }

  if (err.code === "FILE_SIZE_ERROR") {
    if (err.fieldname === "govId") {
      errors["govId.image"] = "Government Id must be between 50KB and 100KB";
    } else if (err.fieldname === "profilePic") {
      errors["profilePic"] = "Profile must be between 50KB and 100KB";
    }
  }

  //Update form error
  //validate error
  if (err.message.includes("Validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }
  //   console.log(errors);
  if (err.code === 11000 && Object.keys(err.keyPattern)[0] === "email") {
    errors.email = "The email already exists";
    return errors;
  }

  if (err.message.includes("UserDepartment validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (
    err.code === 11000 &&
    Object.keys(err.keyPattern)[0] === "departmentName"
  ) {
    errors.departmentName = "The department already exists";
    // console.log(errors);
    return errors;
  }

  if (
    err.code === 11000 &&
    Object.keys(err.keyPattern)[0] === "designationName"
  ) {
    errors.designationName = "The designation already exists";
    // console.log(errors);
    return errors;
  }

  if (err.message.includes("Designation validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }
  return errors;
};

module.exports = { handleErrors };
