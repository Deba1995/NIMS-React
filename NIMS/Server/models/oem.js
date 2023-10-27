const mongoose = require("mongoose");
const { isEmail } = require("validator");

const oemSchema = new mongoose.Schema(
  {
    oemName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please enter a valid oem"],
      maxlength: [15, "Oem name must not exceed 15 characters"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter an e-mail"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid e-mail"],
    },
    tollphone: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid toll free number"],
      minlength: [10, "toll free number must be atleast 10 digits"],
      maxlength: [20, "toll free must not exceed 12 digits"],
    },
    oemCode: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true],
    },
    contact: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid phone number"],
      minlength: [10, "contact number must be atleast 10 digits"],
      maxlength: [20, "contact numer must not exceed 10 digits"],
    },
    contactName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      default: "--None--",
      maxlength: [15, "Oem name must not exceed 15 characters"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Please enter an address"],
      minlength: [2, "Address must be atleast 2 chracters long"],
    },
  },
  { timestamps: true }
);

const oemCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const oemProductSchema = new mongoose.Schema(
  {
    oemCode: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid OEM"],
    },
    categoryName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid category"],
    },
    subcategoryName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid subcategory"],
    },
    modelName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid model"],
    },
    additionalInfo: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, "Atleast 3 characters is required"],
      required: [true, "Please enter valid specs"],
    },
  },
  { timestamps: true }
);

const oemSubCategorySchema = new mongoose.Schema(
  {
    subcategoryName: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const oemOrderSchema = new mongoose.Schema(
  {
    sectorName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid sector"],
    },
    clientName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid client"],
    },
    departmentName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please enter a valid department"],
    },
    orderId: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please enter a valid OrderId"],
      index: true,
    },
    orderDate: {
      type: String,
      required: [true, "Please enter a valid order date"],
    },
    challanNo: {
      type: String,
      unique: true,
      required: [true, "Please enter a valid challan"],
    },
    challanDate: {
      type: String,
      required: [true, "Please enter a valid challan date"],
    },

    details: [
      {
        oemName: {
          type: String,
          required: [true, "Table data cannot be empty for oem"],
          index: true,
        },
        categoryName: {
          type: String,
          required: [true, "Table data cannot be empty for category"],
        },
        subcategoryName: {
          type: String,
          required: [true, "Table data cannot be empty for subcategory"],
        },
        modelName: {
          type: String,
          required: [true, "Table data cannot be empty for subcategory"],
        },

        oemStartDate: {
          type: String,
          required: [true, "Table data cannot be empty for oem Start Date"],
        },
        oemEndDate: {
          type: String,
          required: [true, "Table data cannot be empty for oem End Date"],
        },
        warrantyStart: {
          type: String,
          required: [
            true,
            "Table data cannot be empty for Warranty Start Date",
          ],
        },
        warrantyEnd: {
          type: String,
          required: [true, "Table data cannot be empty for Warranty End Date"],
        },
        serialNumber: {
          type: String,
          required: [true, "Table data cannot be empty for serial number"],
          index: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const oem = mongoose.model("Oem", oemSchema);
const oemProduct = mongoose.model("OemProduct", oemProductSchema);
const oemSubCategory = mongoose.model("OemSubCategory", oemSubCategorySchema);
const oemCategory = mongoose.model("OemCategory", oemCategorySchema);
const oemOrder = mongoose.model("OemOrder", oemOrderSchema);
module.exports = {
  oem,
  oemProduct,
  oemCategory,
  oemSubCategory,
  oemOrder,
};
