const { user, admin } = require("../models/user");
const path = require("path");
const csv = require("csvtojson");
const { oem, oemProduct, oemCategory, oemOrder } = require("../models/oem");

const { clientsector, client } = require("../models/client");

const { handleErrors } = require("./userModule/handleError");
const { handleErrorsOem } = require("./oemModule/handleErrorOem");

const {
  sectorView,
  createSector,
  editSector,
  deleteSector,
} = require("./clientModule/sector-controller");

const {
  departmentView,
  createDepartment,
  editDepartment,
  deleteDepartment,
} = require("./userModule/department-controller");

const {
  designationView,
  createDesignation,
  editDesignation,
  deleteDesignation,
} = require("./userModule/designation-controller");

const {
  userList,
  creatingUser,
  editSingleUser,
  deleteUser,
} = require("./userModule/user-controller");

const {
  createClient,
  clientList,
  editSingleClient,
  deleteClient,
} = require("./clientModule/client-controller");
const {
  createOem,
  oemList,
  editSingleOem,
  deleteOem,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
} = require("./oemModule/oem-controller");
const jwt = require("jsonwebtoken");

//Creating Token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (userInfo) => {
  return jwt.sign(userInfo, "my secret key", {
    expiresIn: maxAge,
  });
};

//===============================================================================================================
//================================   MAIN VIEWS  ================================================================
//===============================================================================================================

const homeView = async (req, res, next) => {
  res.redirect("/index");
};

const logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ success: true, message: "Logging out" });
};

const adminDashboardView = async (req, res, next) => {
  const totalUsersCount = await user.countDocuments();
  const totalClientCount = await client.countDocuments();
  const totalAdminCount = await admin.countDocuments();
  const totalOrderCount = await oemOrder.countDocuments();
  const totalProductCount = await oemProduct.countDocuments();
  const totalOemCount = await oem.countDocuments();

  res.status(201).json({
    totalUsersCount: totalUsersCount,
    totalClientCount: totalClientCount,
    totalAdminCount: totalAdminCount,
    totalOrderCount: totalOrderCount,
    totalProductCount: totalProductCount,
    totalOemCount: totalOemCount,
    success: true,
    message: "Data retrieved successfully",
  });
};

const creatingAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, license } = req.body;

    const newAdmin = new admin({
      firstName,
      lastName,
      email,
      phone,
      password,
      license,
    });

    const adminRegister = await newAdmin.save();
    if (adminRegister) {
      const token = createToken({
        uid: adminRegister._id,
        role: adminRegister.role,
      });
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log("Sign up successful");
      res.status(201).json({
        user: adminRegister._id,
        message: "User signed up successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userLogin = await user.login(email, password, admin);
    console.log(userLogin.firstName);
    if (userLogin.role === "admin") {
      const token = createToken({
        uid: userLogin._id,
        name: userLogin.firstName,
        role: userLogin.role,
      });
      res.cookie("jwt", token, {
        withCredentials: true,
        httpOnly: false,
        maxAge: maxAge * 1000,
      });
      console.log("Logged in as Admin");
      res.status(200).json({
        user: userLogin.email,
        name: userLogin.firstName,
        role: userLogin.role,
        token: token,
        success: true,
        message: "Logging you in!!",
      });
    } else {
      const token = createToken({
        uid: userLogin._id,
        name: userLogin.firstName,
        role: userLogin.role,
      });
      res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
      console.log("Logged in as user");
      res.status(200).json({
        user: userLogin.email,
        message: "User logged in successfully",
        token: token,
        success: true,
        message: "Logging you in!!",
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const createRoles = async (req, res, next) => {
  res.render("admin/roles");
};
const adminProfile = async (req, res) => {
  const id = req.user.uid;
  const user = await admin.findOne({ _id: id });
  if (user) {
    res.status(200).json({
      profile: user,
      success: true,
      message: "Profile retrieved Successfully",
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Error retrieving the profile" });
  }
};

const editAdminProfile = async (req, res) => {
  try {
    const id = req.user.uid;
    let flag = false;
    const { password, confirmpassword, ...updatedData } = req.body;

    if (!password == "" && !confirmpassword == "") {
      if (password === confirmpassword) {
        updatedData.password = password;
        flag = true;
      } else {
        const error = new Error("Password mismatch. Check the password.");
        error.code = "PASSWORD_MISMATCH_ERROR";
        error.message = "Password do not match.";
        throw error;
      }
    }

    const result = await admin.findOneAndUpdate({ _id: id }, updatedData, {
      new: true,
      runValidators: true,
    });

    const updatedAdminData = await result.save();
    if (flag) {
      res.cookie("jwt", "", { maxAge: 1 });
      res.status(200).json({ success: true, message: "Please Login again" });
    } else {
      if (updatedAdminData) {
        res.status(201).json({
          profile: id,
          success: true,
          message: "Profile Update Successfully",
        });
      } else {
        throw new Error("User not found");
      }
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

//Recover Password
const recoverPass = async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;
    const newAdmin = await admin.findOne({ email }); // 1. Find the Admin by Email
    // 2. Check if Admin Exists
    if (!newAdmin) {
      return res.status(404).json({ message: "Email not found" });
    }
    if (password !== confirmpassword) {
      return res.status(404).json({ message: "Passwords do not match" });
    }
    // 3. Update the Password
    if (password === confirmpassword) {
      // Assuming "password" is the field in the admin model where you store the hashed password.
      newAdmin.password = password;
      await newAdmin.save();
      // Add this line to save the updated admin information
      await admin.findOneAndUpdate(
        { email },
        { new: true, runValidators: true }
      );

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      const error = new Error("Password mismatch. Check the password.");
      error.code = "PASSWORD_MISMATCH_ERROR";
      error.message = "Password does not match.";
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password recovery failed" });
  }
};
//===============================================================================================================
//================================   OEM ACTIONS  ================================================================
//===============================================================================================================

/*---------------------------------------------------------------------
             Start oem process
-----------------------------------------------------------------------*/
const oemOrderList = async (req, res, next) => {
  try {
    const orders = await oemOrder.find({});
    const clients = await client.find({});
    const sectors = await clientsector.find({});
    const oems = await oem.find({});
    const products = await oemProduct.find({});
    const category = await oemCategory.find({});
    res.status(201).json({
      orders: orders,
      clients: clients,
      sectors: sectors,
      oems: oems,
      products: products,
      category: category,
      message: "Data retrieved successfully ",
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error retrieving data ",
      success: false,
    });
  }
};
const createOemOrder = async (req, res, next) => {
  try {
    const {
      sectorName,
      clientName,
      departmentName,
      orderId,
      orderDate,
      challanNo,
      challanDate,
      details,
    } = req.body;
    const newOemOrder = new oemOrder({
      sectorName,
      clientName,
      departmentName,
      orderId,
      orderDate,
      challanNo,
      challanDate,
      details,
    });
    // console.log(newOemOrder)
    const oemOrderRegistered = await newOemOrder.save();
    if (oemOrderRegistered) {
      res.status(201).json({
        oemOrders: oemOrderRegistered,
        success: true,
        message: "Oem order created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsOem(err);
    console.log(errors);

    res.status(400).json({ errors });
  }
};
const oemOrderUpdate = async (req, res, next) => {
  const id = req.params.id;
  oemOrder
    .findOneAndUpdate({ _id: id }, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        oemOrders: id,
        success: true,
        message: "Order updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      const errors = handleErrorsOem(err);
      res.status(400).json({ errors });
    });
};
const oemOrderDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    oemOrder
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Order deleted successfully",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ success: false, message: "Error deleting the order" });
      });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error " });
  }
};
/*---------------------------------------------------------------------
              End oem process
-----------------------------------------------------------------------*/

/*---------------------------------------------------------------------
              start product process
-----------------------------------------------------------------------*/
createOem,
  oemList,
  editSingleOem,
  deleteOem,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
  /*---------------------------------------------------------------------
              end product process
-----------------------------------------------------------------------*/

  /*---------------------------------------------------------------------
              start order process
-----------------------------------------------------------------------*/

  /*---------------------------------------------------------------------
              end order process
-----------------------------------------------------------------------*/

  //===============================================================================================================
  //================================   CLIENT SECTOR ACTIONS  ================================================================
  //===============================================================================================================

  sectorView;
createSector;
editSector;
deleteSector;

//===============================================================================================================
//================================   CLIENT ACTIONS  ================================================================
//===============================================================================================================

createClient;
clientList;
editSingleClient;
deleteClient;

//===============================================================================================================
//================================   USER ACTIONS  ================================================================
//===============================================================================================================

userList;
creatingUser;
editSingleUser;
deleteUser;

//===============================================================================================================
//================================   USER DEPARTMENT ACTIONS  ================================================================
//===============================================================================================================
departmentView;
createDepartment;
editDepartment;
deleteDepartment;

//===============================================================================================================
//================================   USER DESIGNATION ACTIONS  ================================================================
//===============================================================================================================
designationView;
createDesignation;
editDesignation;
deleteDesignation;

//===============================================================================================================
//================================   MODULES EXPORT  ================================================================
//===============================================================================================================
module.exports = {
  homeView,
  creatingAdmin,
  login,
  logout,
  recoverPass,
  adminDashboardView,
  createRoles,
  departmentView,
  createDepartment,
  editDepartment,
  deleteDepartment,
  designationView,
  createDesignation,
  editDesignation,
  deleteDesignation,
  creatingUser,
  editSingleUser,
  userList,
  deleteUser,
  sectorView,
  createSector,
  editSector,
  deleteSector,
  createClient,
  editSingleClient,
  deleteClient,
  clientList,
  createOem,
  oemList,
  editSingleOem,
  deleteOem,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
  oemOrderList,
  createOemOrder,
  oemOrderUpdate,
  oemOrderDelete,
  adminProfile,
  editAdminProfile,
};
