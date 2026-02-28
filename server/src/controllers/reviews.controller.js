const reviewsService = require("../services/reviews.service");

// GET /api/providers/:id/reviews
const getByProvider = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await reviewsService.getByProvider(
      req.params.id,
      page,
      limit,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/providers/:id/reviews  (auth required)
const create = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review = await reviewsService.create(
      req.params.id,
      req.user.id,
      rating,
      comment || null,
    );

    res.status(201).json({ message: "Review submitted", data: review });
  } catch (err) {
    next(err);
  }
};

module.exports = { getByProvider, create };
