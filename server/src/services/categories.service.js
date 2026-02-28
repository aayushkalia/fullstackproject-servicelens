const db = require("../config/db");

// List all categories
const getAll = async () => {
  const result = await db.query("SELECT * FROM categories ORDER BY id");
  return result.rows;
};

module.exports = { getAll };
