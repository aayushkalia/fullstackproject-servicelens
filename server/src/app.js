const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- Health Check ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/categories.routes"));
app.use("/api/providers", require("./routes/providers.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

module.exports = app;
