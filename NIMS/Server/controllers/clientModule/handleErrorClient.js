"use strict";

const handleErrorsClient = (err) => {
  // err.message and err.codes

  let errors = {
    sectorName: "",
    sectorCode: "",
    clientName: "",
    departmentCode: "",
    departmentName: "",
    departments: "",
    address: "",
    phone: "",
    state: "",
    city: "",
    country: "",
    email: "",
    postal: "",
    clientId: "",
    "departments.0": "",
    "departments.$": "",
  };

  //Update form error
  //validate error
  if (err.message.includes("Validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("ClientSector validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("Client validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.code === 11000 && Object.keys(err.keyPattern)[0] === "sectorName") {
    errors.sectorName = "The sector already exists";
    // console.log(errors);
    return errors;
  }

  if (
    err.code === 11000 &&
    Object.keys(err.keyPattern)[0] === "clientId"
  ) {
    errors.departmentName = "The client ID already exists";
    // console.log(errors);
    return errors;
  }

  if (
    err.code === 11000 &&
    Object.keys(err.keyPattern)[0] === "clientName"
  ) {
    errors.departmentName = "The client already exists";
    // console.log(errors);
    return errors;
  }

  if (err.code === 11000 && Object.keys(err.keyPattern)[0] === "email") {
    errors.email = "The email already exists";
    return errors;
  }

  if (
    err.code === 11000 &&
    Object.keys(err.keyPattern)[0] === "organisationName"
  ) {
    errors.organisationName = "The organisation already exists";
    // console.log(errors);
    return errors;
  }

  if (err.message.includes("ClientOrganisation validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }

  if (err.message.includes("ClientDepartment validation failed")) {
    Object.values(err.errors).forEach((value) => {
      errors[value.properties.path] = value.properties.message;
    });
  }
  console.log(errors);
  return errors;
};

module.exports = { handleErrorsClient };
