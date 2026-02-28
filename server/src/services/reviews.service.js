const db = require("../config/db");

// Get reviews for a provider (paginated)
const getByProvider = async (providerId, page = 1, limit = 10) => {
  const offset = (Number(page) - 1) * Number(limit);

  const result = await db.query(
    `SELECT pr.id, pr.rating, pr.comment, pr.created_at,
            u.name AS user_name
     FROM provider_reviews pr
     JOIN users u ON u.id = pr.user_id
     WHERE pr.provider_id = $1
     ORDER BY pr.created_at DESC
     LIMIT $2 OFFSET $3`,
    [providerId, Number(limit), offset],
  );

  const countResult = await db.query(
    "SELECT COUNT(*) FROM provider_reviews WHERE provider_id = $1",
    [providerId],
  );

  const totalCount = Number(countResult.rows[0].count);

  return {
    data: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
    },
  };
};

// Submit a review
const create = async (providerId, userId, rating, comment) => {
  // Check provider exists
  const provider = await db.query("SELECT id FROM providers WHERE id = $1", [
    providerId,
  ]);
  if (provider.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  // Insert review (UNIQUE constraint will prevent duplicates)
  try {
    const result = await db.query(
      `INSERT INTO provider_reviews (provider_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, rating, comment, created_at`,
      [providerId, userId, rating, comment],
    );

    // Update denormalized avg_rating + review_count on providers table
    await db.query(
      `UPDATE providers SET
         avg_rating = sub.avg,
         review_count = sub.cnt
       FROM (
         SELECT ROUND(AVG(rating), 2) AS avg, COUNT(*) AS cnt
         FROM provider_reviews
         WHERE provider_id = $1
       ) sub
       WHERE providers.id = $1`,
      [providerId],
    );

    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation — user already reviewed this provider
      const error = new Error("You have already reviewed this provider");
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

module.exports = { getByProvider, create };
