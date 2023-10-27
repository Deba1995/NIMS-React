const { user, admin } = require("../models/user");
const path = require("path");
const csv = require("csvtojson");
const {
  oem,
  oemProduct,
  oemSubCategory,
  oemCategory,
  oemOrder,
} = require("../models/oem");

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
};
