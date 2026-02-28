const db = require("../config/db");

// ─── PROVIDER CRUD ───

// Create a new provider
const createProvider = async (data) => {
  const {
    category_id,
    name,
    description,
    city,
    address,
    phone,
    email,
    website,
  } = data;

  const result = await db.query(
    `INSERT INTO providers (category_id, name, description, city, address, phone, email, website, is_approved)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
     RETURNING *`,
    [
      category_id,
      name,
      description,
      city,
      address,
      phone || null,
      email || null,
      website || null,
    ],
  );

  return result.rows[0];
};

// Update provider
const updateProvider = async (id, data) => {
  const { name, description, city, address, phone, email, website } = data;

  const result = await db.query(
    `UPDATE providers
     SET name = COALESCE($2, name),
         description = COALESCE($3, description),
         city = COALESCE($4, city),
         address = COALESCE($5, address),
         phone = COALESCE($6, phone),
         email = COALESCE($7, email),
         website = COALESCE($8, website)
     WHERE id = $1
     RETURNING *`,
    [id, name, description, city, address, phone, email, website],
  );

  if (result.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// Delete provider
const deleteProvider = async (id) => {
  const result = await db.query(
    "DELETE FROM providers WHERE id = $1 RETURNING id",
    [id],
  );

  if (result.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// Approve / reject provider
const setApproval = async (id, is_approved) => {
  const result = await db.query(
    "UPDATE providers SET is_approved = $2 WHERE id = $1 RETURNING id, name, is_approved",
    [id, is_approved],
  );

  if (result.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// List pending (unapproved) providers
const getPending = async () => {
  const result = await db.query(
    "SELECT id, name, city, created_at FROM providers WHERE is_approved = FALSE ORDER BY created_at DESC",
  );
  return result.rows;
};

// ─── SERVICE PRICING CRUD ───

// Add a service + price to a provider
const addService = async (data) => {
  const { provider_id, service_name, price, unit, description } = data;

  // Check provider exists
  const provider = await db.query("SELECT id FROM providers WHERE id = $1", [
    provider_id,
  ]);
  if (provider.rows.length === 0) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }

  const result = await db.query(
    `INSERT INTO service_pricing (provider_id, service_name, price, unit, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      provider_id,
      service_name,
      price,
      unit || "per visit",
      description || null,
    ],
  );

  return result.rows[0];
};

// Update a service price
const updateService = async (id, data) => {
  const { service_name, price, unit, description } = data;

  const result = await db.query(
    `UPDATE service_pricing
     SET service_name = COALESCE($2, service_name),
         price = COALESCE($3, price),
         unit = COALESCE($4, unit),
         description = COALESCE($5, description)
     WHERE id = $1
     RETURNING *`,
    [id, service_name, price, unit, description],
  );

  if (result.rows.length === 0) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

// Delete a service
const deleteService = async (id) => {
  const result = await db.query(
    "DELETE FROM service_pricing WHERE id = $1 RETURNING id",
    [id],
  );

  if (result.rows.length === 0) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

module.exports = {
  createProvider,
  updateProvider,
  deleteProvider,
  setApproval,
  getPending,
  addService,
  updateService,
  deleteService,
};
