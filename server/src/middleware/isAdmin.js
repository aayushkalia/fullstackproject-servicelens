// Must be used AFTER auth middleware (req.user must exist)
// Blocks non-admin users from accessing admin routes
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = isAdmin;
