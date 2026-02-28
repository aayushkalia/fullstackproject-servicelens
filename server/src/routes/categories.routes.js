const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

// GET /api/categories
router.get("/", categoriesController.getAll);

module.exports = router;
