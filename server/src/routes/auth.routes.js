const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/auth.controller");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me  (protected)
router.get("/me", auth, authController.me);

module.exports = router;
