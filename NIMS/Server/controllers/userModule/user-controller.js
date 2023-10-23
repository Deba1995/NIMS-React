const { user, userdesignation, userdepartment } = require("../../models/user");

const { handleErrors } = require("./handleError");

const fs = require("fs");

const path = require("path");

const addUserView = async (req, res, next) => {
  const users = await user.find({});
  const designations = await userdesignation.find({});
  const departments = await userdepartment.find({});
  res.render("admin/add-user", {
    users: users,
    designations: designations,
    departments: departments,
  });
};
const userList = async (req, res, next) => {
  const users = await user.find({});
  const designations = await userdesignation.find({});
  const departments = await userdepartment.find({});
  res.status(201).json({
    users: users,
    departments: departments,
    designations: designations,
    message: "Data etrieved successfully ",
    success: true,
  });
};

const creatingUser = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      userName,
      email,
      employeeId,
      phone,
      dept,
      desg,
      password,
      gender,
      address,
      city,
      state,
      country,
      postal,
      doj,
    } = req.body;
    const date = new Date(doj);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(date.getDate()).padStart(2, "0");
    doj = `${year}-${month}-${day}`;

    console.log(req.body);
    //creating new user document
    const newUser = new user({
      firstName,
      lastName,
      userName,
      email,
      employeeId,
      phone,
      dept,
      desg,
      password,
      gender,
      address,
      city,
      state,
      country,
      postal,
      doj,
    });
    if (req.files?.profilePic) {
      validateImage(req.files.profilePic[0], newUser, "profilePic");
    }

    if (req.files?.govId) {
      validateImage(req.files.govId[0], newUser, "govId");
    }

    // saving the document
    const userRegister = await newUser.save();
    if (userRegister) {
      console.log("Sign up successful");
      res
        .status(201)
        .json({
          user: userRegister,
          success: true,
          message: "User created successfully",
        });
    }
  } catch (err) {
    console.log(err);
    if (req.files?.profilePic) {
      unlinkImageFile(req.files?.profilePic[0]);
    }

    if (req.files?.govId) {
      unlinkImageFile(req.files?.govId[0]);
    }

    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const editSingleUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await user.findOne({ employeeId: id });
    const { password, confirmpassword, ...updatedData } = req.body;

    if (!password == "" && !confirmpassword == "") {
      if (password === confirmpassword) {
        updatedData.password = password;
      } else {
        const error = new Error("Password mismatch. Check the password.");
        error.code = "PASSWORD_MISMATCH_ERROR";
        error.message = "Password do not match.";
        throw error;
      }
    }

    if (req.files?.profilePic) {
      if (
        validateImage(req.files.profilePic[0], updatedData, "profilePic") &&
        doc
      ) {
        unlinkImageFile(doc.profilePic);
      }
    }
    if (req.files?.govId) {
      if (validateImage(req.files.govId[0], updatedData, "govId") && doc) {
        unlinkImageFile(doc.govId);
      }
    }

    const updateUser = await user.findOneAndUpdate({employeeId: id}, updatedData, {
      runValidators: true,
    });

    const updatedUserData = await updateUser.save();
    console.log(updatedUserData)
    if (updatedUserData) {
      console.log("Updated successfully");
      res.status(201).json({
         user: updatedUserData,
         success: true,
         message: "User updated successfully"
      });
    }
  } catch (err) {
    if (req.files?.profilePic) {
      unlinkImageFile(req.files?.profilePic[0]);
    }

    if (req.files?.govId) {
      unlinkImageFile(req.files?.govId[0]);
    }
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const singleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const singleUser = await user.find({ _id: userId });
    const designations = await userdesignation.find({});
    const departments = await userdepartment.find({});

    if (!singleUser) {
      // Handle the case when the user with the provided ID is not found
      const err = { message: "Not found" };
      res.status(404).json({ err });
    }

    res.render(`admin/user-profile`, {
      singleUser: singleUser[0],
      designations: designations,
      departments: departments,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await user.findOne({ _id: id });

    const deletedUser = await user.findByIdAndDelete(id);

    if (deletedUser) {
      unlinkImageFile(doc?.profilePic);
      unlinkImageFile(doc?.govId);
      res.json({ 
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const validateImage = (file, document, imageFieldName) => {
  const checkedExt = checkFileExtension(file, imageFieldName);
  const checkedSize = checkFileSize(file);
  if (checkedExt && checkedSize) {
    document[imageFieldName] = {
      image: checkedExt,
      filename: file.filename,
      fieldname: imageFieldName,
    };
    return true;
  } else {
    throw error;
  }
};

const unlinkImageFile = (file) => {
  let pathImg = path.join(
    __dirname +
      "/" +
      `../../uploads/assets/img/${file.fieldname}/` +
      file.filename
  );

  if (fs.existsSync(pathImg)) {
    // Remove the file
    fs.unlinkSync(pathImg);
    console.log("File removed successfully.");
  } else {
    console.log("File not found.");
  }
};

const checkFileExtension = (file, imageFieldName) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file?.mimetype)) {
    if (file.fieldname === imageFieldName) {
      let pathImg = path.join(
        __dirname +
          "/" +
          `../../uploads/assets/img/${imageFieldName}/` +
          file.filename
      );
      let imgData = fs.readFileSync(pathImg);
      let imgURL = `data:image/${file.mimetype};base64,${imgData.toString(
        "base64"
      )}`;
      return imgURL;
    } else {
      console.log("Something went wrong.......");
    }
  } else {
    const error = new Error(
      "Invalid file extension. Only JPEG and PNG files are allowed."
    );
    error.code = "FILE_EXTENSION_ERROR";
    error.message = "Only JPEG, JPG and PNG files are allowed.";
    error.fieldname = file.fieldname;
    throw error;
  }
};

const checkFileSize = (file) => {
  // Check file size
  const maxSize = 100 * 1024; // 100KB
  const minSize = 4 * 1024; // 10KB
  if (file?.size >= minSize && file?.size <= maxSize) {
    // Accept the file
    return true;
  } else {
    // Reject the file with an error
    const error = new Error("File size must be between 4KB and 100KB.");
    error.code = "FILE_SIZE_ERROR";
    // error.message = "File size must be between 50KB and 100KB.";
    error.fieldname = file.fieldname;
    throw error;
  }
};

module.exports = {
  addUserView,
  userList,
  creatingUser,
  editSingleUser,
  singleUser,
  deleteUser,
};
