const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/admin.controller");

// All admin routes require authentication + admin role
router.use(auth, isAdmin);

// ─── PROVIDERS ───
router.get("/providers/pending", adminController.getPending);
router.post("/providers", adminController.createProvider);
router.patch("/providers/:id", adminController.updateProvider);
router.delete("/providers/:id", adminController.deleteProvider);
router.patch("/providers/:id/approve", adminController.approveProvider);
router.patch("/providers/:id/reject", adminController.rejectProvider);

// ─── SERVICE PRICING ───
router.post("/services", adminController.addService);
router.patch("/services/:id", adminController.updateService);
router.delete("/services/:id", adminController.deleteService);

module.exports = router;
