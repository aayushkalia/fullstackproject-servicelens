const db = require("../config/db");

// List providers with filtering, sorting, and pagination
const getFiltered = async (filters) => {
  const {
    category,
    city,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
    page = 1,
    limit = 10,
  } = filters;

  // Build WHERE conditions dynamically
  const conditions = ["p.is_approved = TRUE"];
  const params = [];
  let paramIndex = 1;

  if (category) {
    conditions.push(`c.name ILIKE $${paramIndex++}`);
    params.push(category);
  }

  if (city) {
    conditions.push(`p.city ILIKE $${paramIndex++}`);
    params.push(city);
  }

  if (minRating) {
    conditions.push(`p.avg_rating >= $${paramIndex++}`);
    params.push(Number(minRating));
  }

  // Price filters — only apply if we have price params
  // These require a JOIN to service_pricing, which we always include
  if (minPrice) {
    conditions.push(`sp.price >= $${paramIndex++}`);
    params.push(Number(minPrice));
  }

  if (maxPrice) {
    conditions.push(`sp.price <= $${paramIndex++}`);
    params.push(Number(maxPrice));
  }

  const whereClause = conditions.join(" AND ");

  // Sort
  let orderClause = "p.created_at DESC"; // default
  if (sortBy === "price") orderClause = "MIN(sp.price) ASC";
  if (sortBy === "price_desc") orderClause = "MIN(sp.price) DESC";
  if (sortBy === "rating") orderClause = "p.avg_rating DESC";

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);

  // Main query — group by provider to get lowest price per provider
  const query = `
    SELECT
      p.id,
      p.name,
      p.city,
      p.avg_rating,
      p.review_count,
      c.name AS category,
      MIN(sp.price) AS min_price,
      COUNT(*) OVER() AS total_count
    FROM providers p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN service_pricing sp ON sp.provider_id = p.id
    WHERE ${whereClause}
    GROUP BY p.id, p.name, p.city, p.avg_rating, p.review_count, c.name, p.created_at
    ORDER BY ${orderClause}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  params.push(Number(limit), offset);

  const result = await db.query(query, params);

  const totalCount =
    result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;

  // Remove total_count from each row (it's metadata, not data)
  const data = result.rows.map(({ total_count, ...rest }) => rest);

  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)),
    },
  };
};

// Get single provider by ID with all its services
const getById = async (id) => {
  const providerResult = await db.query(
    `SELECT p.*, c.name AS category
     FROM providers p
     JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [id],
  );

  if (providerResult.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  const servicesResult = await db.query(
    "SELECT id, service_name, price, unit, description FROM service_pricing WHERE provider_id = $1 ORDER BY price",
    [id],
  );

  return {
    ...providerResult.rows[0],
    services: servicesResult.rows,
  };
};

module.exports = { getFiltered, getById };
