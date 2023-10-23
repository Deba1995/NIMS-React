const express = require("express");
const router = express.Router();
// Import your middleware and controllers
const { requireAuth } = require("../../middleware/auth-middleware");
const { upload } = require("../../middleware/upload-middleware");
const {
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
  userList,
  singleUser,
  editSingleUser,
  deleteUser,
} = require("../../controllers/auth-controller");

/*---------------------------------------------------------------------
             Start User Module Routes
-----------------------------------------------------------------------*/
//User Action
// router.get("/user/add-user", requireAuth, addUserView);
router.post(
  "/api/user/user-add-user",
  requireAuth,
  upload.fields([
    { name: "govId", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  creatingUser
);

router.put(
  "/api/user/user-update-user/:id",
  requireAuth,
  upload.fields([
    { name: "govId", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  editSingleUser
);




// Department Action
router.get("/api/user/user-get-department", requireAuth, departmentView);
router.post("/api/user/user-add-department", requireAuth, createDepartment);
router.put("/api/user/add-department/:id", requireAuth, editDepartment);
router.delete("/api/user/add-department/:id", requireAuth, deleteDepartment);

//Designation Action
router.get("/api/user/user-get-designation", requireAuth, designationView);
router.post("/api/user/user-add-designation", requireAuth, createDesignation);
router.put("/api/user/user-update-designation/:id", requireAuth, editDesignation);
router.delete("/api/user/user-delete-designation/:id", requireAuth, deleteDesignation);

//User action
 router.get("/api/user/user-get-user", requireAuth, userList);
 
// router.get("/user/user-profile/:id", requireAuth, singleUser);
router.delete("/api/user/user-delete-user/:id", requireAuth, deleteUser);

/*---------------------------------------------------------------------
             End User Module Routes
-----------------------------------------------------------------------*/

module.exports = router;
