const express = require("express");
const router = express.Router();
// Import your middleware and controllers
const { requireAuth } = require("../../middleware/auth-middleware");
const uploadCSV = require("../../middleware/csv-middleware");

const {
  createOem,
  oemList,
  editSingleOem,
  deleteOem,
  oemProductList,
  oemProductAdd,
  oemProductDelete,
  oemProductUpdate,
} = require("../../controllers/auth-controller");

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

/*---------------------------------------------------------------------
             End OEM Module Routes
-----------------------------------------------------------------------*/

module.exports = router;
