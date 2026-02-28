const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log unexpected errors (prevents silent crashes)
pool.on("error", (err) => {
  console.error("❌ Unexpected DB pool error:", err.message);
});

// Test the connection on startup
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected"))
  .catch((err) =>
    console.error("❌ PostgreSQL connection error:", err.message),
  );

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
