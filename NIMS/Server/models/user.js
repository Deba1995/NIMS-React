const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

//Admin Schema
const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please enter a valid name"],
    minlength: [4, "Minimum length is 4 characters"],
    maxlength: [10, "First name must not exceed 10 characters"],
  },
  lastName: {
    type: String,
    trim: true,
    // required: [true, 'Please enter a valid name'],
    maxlength: [10, "Last name must not exceed 10 characters"],
    default: "",
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please enter an e-mail"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid e-mail"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Please enter a valid phone number"],
    minlength: [10, "phone number must be atleast 10 digits"],
    maxlength: [10, "phone number must not exceed 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  license: {
    type: String,
    required: [true, "Enter a valid License"],
    minlength: [10, "license number must be atleast 10 digits"],
    maxlength: [10, "license number must not exceed 10 digits"],
  },
  role: {
    type: String,
    default: "admin",
  },
});

//User Schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid firstname"],
      maxlength: [10, "First name must not exceed 10 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      // required: [true, 'Please enter a valid name'],
      maxlength: [10, "Last name must not exceed 10 characters"],
      default: "",
      required: [true, "Please enter a valid lastname"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter an e-mail"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid e-mail"],
    },
    employeeId: {
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
    dept: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid department"],
    },
    desg: {
      type: String,
      trim: true,
      required: [true, "Please enter a valid designation"],
    },
    gender: {
      type: String,
      required: [true, "Please specify a gender"],
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
    doj: {
      type: String,
      trim: true,
      required: [true, "Enter employee date of joining"],
    },
    profilePic: {
      image: {
        type: String,
      },
      filename: {
        type: String,
      },
      fieldname: {
        type: String,
      },
    },
    govId: {
      image: {
        type: String,
        required: [true, "Please provide an identification"], // The image field is required
      },
      filename: {
        type: String,
        required: [true, "Please provide a valid file name"],
      },
      fieldname: {
        type: String,
        required: [true, "Please provide a valid field name"],
      },
    },
    resume: {
      type: String,
      trim: true,
      default: "Not provided",
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    role: {
      type: String,
      default: "basic",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

//Fire a function before the document is saved in the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); //asynchronus (use await  and async)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Fire a function before the document is saved in the database
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); //asynchronus (use await  and async)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password, admin) {
  const user = await this.findOne({ email });
  const adminUser = await admin.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  } else if (adminUser) {
    const auth = await bcrypt.compare(password, adminUser.password);
    if (auth) {
      return adminUser;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

//Department Schema
const userdeptSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please enter a valid department"],
      maxlength: [15, "Department name must not exceed 15 characters"],
    },
    departmentCode: {
      type: String,
      unique: true,
      required: [true],
    },
  },
  { timestamps: true }
);

//Designation Schema
const userdesgSchema = new mongoose.Schema(
  {
    designationName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Please enter a valid designation"],
      maxlength: [15, "Designation name must not exceed 15 characters"],
    },
    designationCode: {
      type: String,
      unique: true,
      required: [true],
    },
    departmentCode: {
      type: String,
      trim: true,
      required: [true, "Please input a valid department"],
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
const admin = mongoose.model("Admin", adminSchema);
const userdepartment = mongoose.model("UserDepartment", userdeptSchema);
const userdesignation = mongoose.model("UserDesignation", userdesgSchema);

module.exports = {
  user,
  admin,
  userdepartment,
  userdesignation,
};
