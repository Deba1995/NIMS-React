const express = require("express");
const { requireAuth, checkUser } = require("../middleware/auth-middleware");

const userRoutes = require("../controllers/userModule/user-routes");
const clientRoutes = require("../controllers/clientModule/client-routes");
const oemRoutes = require("../controllers/oemModule/oem-routes");

const {
  homeView,
  creatingAdmin,
  login,
  logout,
  adminDashboardView,
  createRoles,
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
router.post("/auth/sign-up", creatingAdmin);

router.get("/roles", requireAuth, createRoles);
/*---------------------------------------------------------------------
             Start Oem Module Routes
-----------------------------------------------------------------------*/
router.use(oemRoutes);

/*---------------------------------------------------------------------
             End Oem Module Routes
-----------------------------------------------------------------------*/
router.get("/api/oem/oem-get-order", requireAuth, oemOrderList);
router.post("/api/oem/oem-add-order", requireAuth, createOemOrder);
router.put("/api/oem/oem-update-order/:id", requireAuth, oemOrderUpdate);
router.delete("/api/oem/oem-delete-order/:id", requireAuth, oemOrderDelete);
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
// Mount user routes using router.use
router.use(userRoutes);
/*---------------------------------------------------------------------
             End User Module Routes
-----------------------------------------------------------------------*/

router.get("/api/index", requireAuth, adminDashboardView);
module.exports = {
  routes: router,
};
