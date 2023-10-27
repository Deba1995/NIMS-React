const express = require("express");
const router = express.Router();
// Import your middleware and controllers
const { requireAuth } = require("../../middleware/auth-middleware");
const {
  sectorView,
  createSector,
  editSector,
  deleteSector,

  createClient,
  editSingleClient,
  deleteClient,
  clientList,
} = require("../../controllers/auth-controller");

/*---------------------------------------------------------------------
             Start Client Module Routes
-----------------------------------------------------------------------*/

//Sector Action
router.get("/api/client/client-get-sector", requireAuth, sectorView);
router.post("/api/client/client-add-sector", requireAuth, createSector);
router.put("/api/client/client-update-sector/:id", requireAuth, editSector);
router.delete(
  "/api/client/client-delete-sector/:id",
  requireAuth,
  deleteSector
);

//Client Action

router.post("/api/client/client-add-client", requireAuth, createClient);
router.get("/api/client/client-get-client", requireAuth, clientList);
router.put(
  "/api/client/client-update-client/:id",
  requireAuth,
  editSingleClient
);
router.delete(
  "/api/client/client-delete-client/:id",
  requireAuth,
  deleteClient
);

/*---------------------------------------------------------------------
             End Client Module Routes
-----------------------------------------------------------------------*/

module.exports = router;
