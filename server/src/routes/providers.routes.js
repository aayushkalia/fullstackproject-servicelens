const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const providersController = require("../controllers/providers.controller");
const reviewsController = require("../controllers/reviews.controller");

// GET /api/providers         — list + filter + sort + paginate
router.get("/", providersController.getAll);

// GET /api/providers/:id     — single provider detail with services
router.get("/:id", providersController.getOne);

// GET /api/providers/:id/reviews   — reviews for a provider
router.get("/:id/reviews", reviewsController.getByProvider);

// POST /api/providers/:id/reviews  — submit a review (auth required)
router.post("/:id/reviews", auth, reviewsController.create);

module.exports = router;
