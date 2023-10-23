"use strict";

const handleErrorsOem = (err) => {
  // err.message and err.codes
  let errors = {
    parentType: "",
    modelName: "",
    subcategoryName: "",
    "subcategories.0": "",
    "subcategories.$": "",
    oemName: "",
    oemCode: "",
    additionalInfo: "",
    categoryName: "",
    categories: "",
    phone: "",
    email: "",
    "categories.0": "",
    "categories.$": "",
    "models.0": "",
    "models.$": "",
  };

  //Update form error
  //validate error
  if (err.message.includes("Validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("OemSubCategory validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("Oem validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }
  if (err.message.includes("OemProduct validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("OemModel validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.code === 11000 && Object.keys(err.keyPattern)[0] === "oemName") {
    errors.departmentName = "The oem already exists";
    // console.log(errors);
    return errors;
  }

  if (err.code === 11000 && Object.keys(err.keyPattern)[0] === "email") {
    errors.email = "The email already exists";
    return errors;
  }
  if (err.code === "CATEGORY NOT FOUND") {
    errors.categoryName = err.message;
    return errors;
  }

  console.log(errors);
  return errors;
};

module.exports = { handleErrorsOem };
