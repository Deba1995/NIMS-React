const {
  user,
  admin,
  userdepartment,
  userdesignation,
} = require("../models/user");
const path = require("path");
const csv = require("csvtojson");
const {
  oem,
  oemProduct,
  oemSubCategory,
  oemCategory,
} = require("../models/oem");

const { clientsector, client } = require("../models/client");

const { handleErrors } = require("./userModule/handleError");
const { handleErrorsClient } = require("./clientModule/handleErrorClient");
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
  addUserView,
  userList,
  creatingUser,
  editSingleUser,
  singleUser,
  deleteUser,
} = require("./userModule/user-controller");

const {
  clientView,
  singleClient,
  createClient,
  clientList,
  editSingleClient,
  deleteClient,
} = require("./clientModule/client-controller");

const jwt = require("jsonwebtoken");

const { error, Console } = require("console");

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
const loginView = async (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    res.redirect("/index");
  } else {
    // User is not authenticated, redirect to '/login' or your login route
    res.render("auth/login");
  }
};

const homeView = async (req, res, next) => {
  res.redirect("/index");
};

const logout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ success: true, message: "Logging out" });
};

const registerView = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    res.redirect("/index");
  } else {
    // User is not authenticated, redirect to '/login' or your login route
    res.render("auth/register");
  }
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
const oemView = async (req, res, next) => {
  const oems = await oem.find({});
  res.render("admin/add-oem", { oems: oems });
}; //not req

const oemList = async (req, res, next) => {
  const oems = await oem.find({});
  res.status(201).json({
    oems: oems,
    message: "Data retrieved successfully ",
    success: true,
  });
};
const createOem = async (req, res, next) => {
  try {
    const { oemName } = req.body;
    const ocode = oemName.slice(0, 2);
    const oemCode = ocode + "001";
    req.body.oemCode = oemCode;

    const newOem = new oem(req.body);
    const oemRegistered = await newOem.save();
    if (oemRegistered) {
      res.status(201).json({
        oems: oemRegistered,
        success: true,
        message: "Oem created successfully",
      });
    }
  } catch (err) {
    const errors = handleErrorsOem(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};
const editSingleOem = async (req, res, next) => {
  const id = req.params.id;

  const { oemName } = req.body;
  const ocode = oemName.slice(0, 2);
  const oemCode = ocode + "001";
  req.body.oemCode = oemCode;

  oem
    .findOneAndUpdate({ _id: id }, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        oemName: id,
        success: true,
        message: "Oem updated successfully",
      });
    })
    .catch((err) => {
      const errors = handleErrorsOem(err);
      res.status(400).json({ errors });
    });
};
const deleteOem = async (req, res, next) => {
  try {
    const id = req.params.id;

    oem
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Oem deleted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const oemProductList = async (req, res, next) => {
  try {
    const oems = await oem.find({});
    const oemProducts = await oemProduct.find({});
    const oemCategorys = await oemCategory.find({});
    const oemSubCategorys = await oemSubCategory.find({});
    res.status(201).json({
      oems: oems,
      oemProduct: oemProducts,
      oemCategory: oemCategorys,
      oemSubCategory: oemSubCategorys,
      message: "Data retrieved successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to retrieve data at this moment",
      success: false,
    });
  }
};

const oemProductAdd = async (req, res, next) => {
  try {
    const { categoryName, subcategoryName } = req.body;
    if (req.file) {
      const filePath = path.join(
        __dirname + "/" + `../uploads/assets/csv/` + req.file.filename
      );
      const jsonArray = await csv().fromFile(filePath);
      if (!jsonArray || jsonArray.length === 0) {
        // No data in the CSV file or error reading the file
        return res.status(400).json({
          message: "No data in the CSV file or error reading the file",
        });
      }

      // Process the CSV data and insert into newOemProduct schema
      const csvDataToSave = jsonArray.map((data) => {
        const ocode = data.oemCode.slice(0, 2); // Modify this based on your actual data
        const oemdCode = ocode + "001";
        // Map CSV data to the schema properties of newOemProduct
        return {
          oemCode: oemdCode.trim(),
          categoryName: data.categoryName.trim(),
          subcategoryName: data.subcategoryName.trim(),
          modelName: data.modelName.trim(),
          additionalInfo: data.additionalInfo.trim(),
          // Add other properties as needed
        };
      });

      // Check if categoryName exists in the CSV data
      const uniqueCategories = [
        ...new Set(
          csvDataToSave.map((item) => item.categoryName.toLowerCase())
        ),
      ];
      console.log(uniqueCategories);
      for (const category of uniqueCategories) {
        console.log(`hi${category}`);
        const ifExistCategory = await oemCategory.findOne({
          categoryName: category,
        });
        console.log(ifExistCategory);
        if (!ifExistCategory) {
          // Create a new entry in the oemCategory schema
          const newCategoryEntry = new oemCategory({ categoryName: category });
          await newCategoryEntry.save();
        }
      }

      // Check if categoryName exists in the CSV data
      const uniqueSubCategories = [
        ...new Set(
          csvDataToSave.map((item) => item.subcategoryName.toLowerCase())
        ),
      ];

      for (const subcategory of uniqueSubCategories) {
        const ifExistSubCategory = await oemSubCategory.findOne({
          subcategoryName: subcategory,
        });
        console.log(ifExistSubCategory);
        if (!ifExistSubCategory) {
          // Create a new entry in the oemCategory schema
          const newCategoryEntry = new oemSubCategory({
            subcategoryName: subcategory,
          });
          await newCategoryEntry.save();
        }
      }
      const savedData = await oemProduct.insertMany(csvDataToSave);

      if (savedData) {
        return res.status(201).json({
          docs: savedData,
          success: true,
          message: "CSV data uploaded successfully",
        });
      } else {
        return res.status(400).json({
          message: "Error saving CSV data to the database",
        });
      }
    } else {
      const newOemProduct = new oemProduct(req.body);
      const oemRegisteredProduct = await newOemProduct.save();
      if (oemRegisteredProduct) {
        let newCat, newSubCat;
        const ifExistCategory = await oemCategory.findOne({ categoryName });

        if (!ifExistCategory) {
          const newCategory = new oemCategory({ categoryName: categoryName });
          newCat = await newCategory.save();
        }
        const ifExistSubCategory = await oemSubCategory.findOne({
          subcategoryName,
        });
        if (!ifExistSubCategory) {
          const newSubCategory = new oemSubCategory({
            subcategoryName: subcategoryName,
          });
          newSubCat = await newSubCategory.save();
        }
        res.status(201).json({
          oemProduct: oemRegisteredProduct,
          oemCategory: newCat,
          oemSubCategory: newSubCat,
          success: true,
          message: "Oem product created successfully",
        });
      }
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsOem(err);
    console.log(errors);
    res.status(400).json({ errors });
  }
};

const oemProductUpdate = async (req, res, next) => {
  const id = req.params.id;

  oemProduct
    .findOneAndUpdate({ _id: id }, req.body, { runValidators: true })
    .then((result) => {
      res.status(201).json({
        oemProduct: id,
        success: true,
        message: "Product updated successfully",
      });
    })
    .catch((err) => {
      const errors = handleErrorsOem(err);
      res.status(400).json({ errors });
    });
};

const oemProductDelete = async (req, res, next) => {
  try {
    const id = req.params.id;

    oemProduct
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Product deleted successfully",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ success: false, message: "Error deleting the product" });
      });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error " });
  }
};

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
    // console.log(req.body)
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
//===============================================================================================================
//================================   Model ACTIONS  ================================================================
//===============================================================================================================

const modelList = async (req, res, next) => {
  const oems = await oem.find({});
  const models = await oemModel.find({});
  res.status(201).json({
    oems: oems,
    models: models,
    message: "Data retrieved successfully ",
    success: true,
  });
};

const singleOemModel = async (req, res, next) => {
  try {
    const oemModelId = req.params.id;
    const oems = await oem.find({});
    const singleOemMod = await oemModel.find({ _id: oemModelId });
    console.log(singleOemMod);

    if (!singleOemMod) {
      // Handle the case when the user with the provided ID is not found
      const err = { message: "Not found" };
      res.status(404).json({ err });
    }

    res.render(`admin/oem-model-profile`, {
      singleOemMod: singleOemMod[0],
      oems: oems,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const singleOem = async (req, res, next) => {
  try {
    const oemId = req.params.id;

    const singleOem = await oem.find({ _id: oemId });

    if (!singleOem) {
      // Handle the case when the user with the provided ID is not found
      const err = { message: "Not found" };
      res.status(404).json({ err });
    }

    res.render(`admin/oem-profile`, {
      singleOem: singleOem[0],
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

const editSingleModel = async (req, res, next) => {
  try {
    const { oemCode, categoryName, models } = req.body;
    console.log(oemCode, categoryName, models);
    if (req.body?.models === undefined) {
      req.body["models"] = "";
    }

    // Check if categoryName exists
    const categoryExists = await oemModel.exists({
      oemCode: oemCode,
      "models.categoryName": categoryName,
    });

    if (!categoryExists) {
      const error = new Error(
        `Category ${categoryName} does not exist for oemCode ${oemCode}`
      );
      error.code = "CATEGORY NOT FOUND";
      error.message = `Category ${categoryName} does not exist!.`;
      throw error;
    }

    const updatedBody = {
      $set: {
        "models.$[elem].modelName": models,
      },
    };

    oemModel
      .findOneAndUpdate({ oemCode: oemCode }, updatedBody, {
        arrayFilters: [{ "elem.categoryName": categoryName }],
        runValidators: true,
      })
      .then((result) => {
        res.status(201).json({
          model: oemCode,
          success: true,
          message: "Model updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        const errors = handleErrorsOem(err);
        console.log(errors);
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleErrorsOem(err);
    res.status(400).json({ errors });
  }
};

const modelView = async (req, res, next) => {
  const oems = await oem.find({});
  res.render("admin/add-model", { oems: oems });
};

const deleteModel = async (req, res, next) => {
  try {
    const id = req.params.id;

    oemModel
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Model deleted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const createModel = async (req, res, next) => {
  try {
    const { oemCode, categoryName, models } = req.body;
    // Check if a document with the given oemCode exists
    let existingOem = await oemModel.findOne({ oemCode });
    if (existingOem) {
      // Check if the category exists for the existing oemCode
      let existingCategory = existingOem.models.find(
        (category) => category.categoryName === categoryName.toLowerCase()
      );

      if (existingCategory) {
        // Update modelName for the existing category
        existingCategory.modelName = existingCategory.modelName.concat(models);
      } else {
        // Create a new category and modelName
        existingOem.models.push({
          categoryName,
          modelName: models,
        });
      }
      // Save the updated document
      const modelsUpdateandCreate = await existingOem.save();
      if (modelsUpdateandCreate) {
        res.status(201).json({
          success: true,
          message: "Model created successfully",
        });
      }
    } else {
      const newModel = new oemModel({
        oemCode,
        models: [{ categoryName, modelName: models }],
      });
      const modelRegistered = await newModel.save();
      if (modelRegistered) {
        res.status(201).json({
          models: modelRegistered,
          success: true,
          message: "Model created successfully",
        });
      }
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsOem(err);
    // console.log(errors);
    res.status(400).json({ errors });
  }
};
const subCategoriesList = async (req, res, next) => {
  const subcategory = await oemSubCategory.find({});
  res.status(201).json({
    subcategory: subcategory,

    message: "Data retrieved successfully ",
    success: true,
  });
};

const createSubCategory = async (req, res, next) => {
  try {
    const { parentType, SubCategoryName, tags } = req.body;
    console.log(parentType, SubCategoryName, tags);
    // Check if a document with the given oemCode exists
    let existingparent = await oemSubCategory.findOne({ parentType });
    if (existingparent) {
      // Check if the category exists for the existing oemCode
      let existingSubCategory = existingparent.subcategories.find(
        (subcategory) =>
          subcategory.SubCategoryName === SubCategoryName.toLowerCase()
      );

      if (existingSubCategory) {
        // Update modelName for the existing category
        existingSubCategory.tags = existingSubCategory.tags.concat(tags);
      } else {
        // Create a new category and modelName
        existingparent.subcategories.push({
          SubCategoryName,
          tags: tags,
        });
      }
      // Save the updated document
      const tagsCategoryUpdateandCreate = await existingparent.save();
      if (tagsCategoryUpdateandCreate) {
        res.status(201).json({
          success: true,
          message: "Tag created successfully",
        });
      }
    } else {
      const newTag = new oemSubCategory({
        parentType,
        subcategories: [{ SubCategoryName, tags: tags }],
      });
      const tagCategoryRegistered = await newTag.save();
      if (tagCategoryRegistered) {
        res.status(201).json({
          subcategory: tagCategoryRegistered,
          success: true,
          message: "Tag created successfully",
        });
      }
    }
  } catch (err) {
    console.log(err);
    const errors = handleErrorsOem(err);
    // console.log(errors);
    res.status(400).json({ errors });
  }
};

const editSubCategory = async (req, res, next) => {
  try {
    const { parentType, SubCategoryName, tags } = req.body;
    console.log(parentType, SubCategoryName, tags);
    if (req.body?.tags === undefined) {
      req.body["subcategories"] = "";
    }

    // Check if categoryName exists
    const subcategoryExists = await oemSubCategory.exists({
      parentType: parentType,
      "subcategories.SubCategoryName": SubCategoryName,
    });

    if (!subcategoryExists) {
      const error = new Error(
        `Category ${SubCategoryName} does not exist for Parent Type ${parentType}`
      );
      error.code = "Sub Category NOT FOUND";
      error.message = `Subcategory ${SubCategoryName} does not exist!.`;
      throw error;
    }

    const updatedBody = {
      $set: {
        "subcategories.$[elem].tags": tags,
      },
    };

    oemSubCategory
      .findOneAndUpdate({ parentType: parentType }, updatedBody, {
        arrayFilters: [{ "elem.SubCategoryName": SubCategoryName }],
        runValidators: true,
      })
      .then((result) => {
        res.status(201).json({
          parentType: parentType,
          success: true,
          message: "Tags updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        const errors = handleErrorsOem(err);
        console.log(errors);
        res.status(400).json({ errors });
      });
  } catch (err) {
    const errors = handleErrorsOem(err);
    res.status(400).json({ errors });
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id;

    oemSubCategory
      .findByIdAndDelete(id)
      .then((result) => {
        res.json({
          success: true,
          message: "Model deleted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
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

clientView;
singleClient;
createClient;
clientList;
editSingleClient;
deleteClient;

//===============================================================================================================
//================================   USER ACTIONS  ================================================================
//===============================================================================================================

addUserView;
userList;
creatingUser;
editSingleUser;
singleUser;
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
  loginView,
  registerView,
  creatingAdmin,
  login,
  logout,
  adminDashboardView,
  createRoles,
  addUserView,
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
  singleUser,
  deleteUser,
  sectorView,
  createSector,
  editSector,
  deleteSector,
  clientView,
  createClient,
  editSingleClient,
  deleteClient,
  clientList,
  singleClient,
  oemView,
  createOem,
  oemList,
  singleOem,
  editSingleOem,
  deleteOem,
  modelView,
  createModel,
  deleteModel,
  modelList,
  singleOemModel,
  editSingleModel,
  createSubCategory,
  subCategoriesList,
  deleteSubCategory,
  editSubCategory,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
  oemOrderList,
  createOemOrder,
  oemOrderUpdate,
  oemOrderDelete,
};
