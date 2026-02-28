const categoriesService = require("../services/categories.service");

// GET /api/categories
const getAll = async (req, res, next) => {
  try {
    const categories = await categoriesService.getAll();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };
