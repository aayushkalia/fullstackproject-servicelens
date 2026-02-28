const providersService = require("../services/providers.service");

// GET /api/providers
const getAll = async (req, res, next) => {
  try {
    const result = await providersService.getFiltered(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/providers/:id
const getOne = async (req, res, next) => {
  try {
    const provider = await providersService.getById(req.params.id);
    res.json({ data: provider });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne };
