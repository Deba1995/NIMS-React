const mongoose = require("mongoose");
const { isEmail } = require("validator");

//Department Schema
const clientSectSchema = new mongoose.Schema(
  {
    sectorName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please enter a valid sector"],
      maxlength: [15, "Sector name must not exceed 15 characters"],
    },
    sectorCode: {
      type: String,
      unique: true,
      required: [true],
    },
  },
  { timestamps: true }
);

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please enter a valid client name"],
      maxlength: [15, "Sector name must not exceed 15 characters"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter an e-mail"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid e-mail"],
    },
    clientId: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid ID"],
      minlength: [5, "ID must be atleast 5 characters long"],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid phone number"],
      minlength: [10, "phone number must be atleast 10 digits"],
      maxlength: [10, "phone number must not exceed 10 digits"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Please enter an address"],
      minlength: [5, "Address must be atleast 5 chracters long"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "Please enter your city"],
    },
    state: {
      type: String,
      trim: true,
      required: [true, "Please enter your state"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "Please enter a country"],
    },
    postal: {
      type: String,
      trim: true,
      required: [true, "Please enter your zip code"],
    },
    departments: {
      type: [
        {
          type: String,
          required: [true, "Atleast one Department is required"], // Department name is required within the array
        },
      ],
      validate: [
        {
          validator: function (value) {
            // Check that the "departments" array is not empty
            return value && value.length > 0;
          },
          message: "Department is required",
        },
        {
          validator: function (value) {
            // Check that the department names within the array are unique
            const uniqueNames = new Set(value);
            return uniqueNames.size === value.length;
          },
          message: "Department names must be unique",
        },
      ],
    },
    sectorCode: {
      type: String,
      trim: true,
      required: [true, "Please input a valid sector"],
    },
  },
  { timestamps: true }
);

const clientsector = mongoose.model("ClientSector", clientSectSchema);
const client = mongoose.model("Client", clientSchema);

module.exports = {
  clientsector,
  client,
};
