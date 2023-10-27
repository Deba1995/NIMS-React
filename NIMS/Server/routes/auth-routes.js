const express = require("express");
const multer = require("multer");

const {
  requireAuth,
  checkUser,
  requireLoginSignInAuth,
} = require("../middleware/auth-middleware");
const uploadCSV = require("../middleware/csv-middleware");

const userRoutes = require("../controllers/userModule/user-routes");
const clientRoutes = require("../controllers/clientModule/client-routes");

const {
  homeView,
  loginView,
  registerView,
  creatingAdmin,
  login,
  logout,
  adminDashboardView,
  createRoles,
  oemView,
  createOem,
  oemList,
  singleOem,
  editSingleOem,
  deleteOem,
  modelView,
  createModel,
  modelList,
  deleteModel,
  singleOemModel,
  editSingleModel,
  createSubCategory,
  subCategoriesList,
  editSubCategory,
  deleteSubCategory,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
  oemOrderList,
  createOemOrder,
  oemOrderUpdate,
  oemOrderDelete,
} = require("../controllers/auth-controller");
const router = express.Router();

router.get("*", checkUser);
router.get("/", requireAuth, homeView);

router.get("/api/auth/logout", logout);

router.post("/auth/sign-in", login);
// router.get("/signup", requireLoginSignInAuth, registerView);
router.post("/auth/sign-up", creatingAdmin);

router.get("/roles", requireAuth, createRoles);
/*---------------------------------------------------------------------
             Start Oem Module Routes
-----------------------------------------------------------------------*/
// router.get("/oems/add-model", requireAuth, modelView);
router.post("/api/oem/oem-add-model", requireAuth, createModel);
router.get("/api/oem/oem-get-model", requireAuth, modelList);
router.delete("/api/oem/oem-delete-model/:id", requireAuth, deleteModel);
// router.get("/oems/model-profile/:id", requireAuth, singleOemModel);
router.put("/api/oem/oem-update-model/:id", requireAuth, editSingleModel);

router.post("/api/oem/oem-add-subcategory", requireAuth, createSubCategory);
router.get("/api/oem/oem-get-subcategory", requireAuth, subCategoriesList);
router.put("/api/oem/oem-update-subcategory/:id", requireAuth, editSubCategory);
router.delete(
  "/api/oem/oem-delete-subcategory/:id",
  requireAuth,
  deleteSubCategory
);

router.get("/api/oem/oem-get-oem", requireAuth, oemList);
router.post("/api/oem/oem-add-oem", requireAuth, createOem);
router.put("/api/oem/oem-update-oem/:id", requireAuth, editSingleOem);
router.delete("/api/oem/oem-delete-oem/:id", requireAuth, deleteOem);

router.get("/api/oem/oem-get-product", requireAuth, oemProductList);
router.post("/api/oem/oem-add-product", requireAuth, oemProductAdd);
router.post(
  "/api/oem/oem-add-product/upload",
  requireAuth,
  uploadCSV.single("csvfile"),
  oemProductAdd
);
router.delete("/api/oem/oem-delete-product/:id", requireAuth, oemProductDelete);
router.put("/api/oem/oem-update-product/:id", requireAuth, oemProductUpdate);

router.get("/api/oem/oem-get-order", requireAuth, oemOrderList);
router.post("/api/oem/oem-add-order", requireAuth, createOemOrder);
router.put("/api/oem/oem-update-order/:id", requireAuth, oemOrderUpdate);
router.delete("/api/oem/oem-delete-order/:id", requireAuth, oemOrderDelete);
/*---------------------------------------------------------------------
             End Oem Module Routes
-----------------------------------------------------------------------*/
// Mount user routes using router.use
router.use(userRoutes);
/*---------------------------------------------------------------------
             Start Client Module Routes
-----------------------------------------------------------------------*/
router.use(clientRoutes);
/*---------------------------------------------------------------------
             End Client Module Routes
-----------------------------------------------------------------------*/

/*---------------------------------------------------------------------
             Start User Module Routes
-----------------------------------------------------------------------*/

/*---------------------------------------------------------------------
             End User Module Routes
-----------------------------------------------------------------------*/

router.get("/api/dashboard", requireAuth, adminDashboardView);
module.exports = {
  routes: router,
};
