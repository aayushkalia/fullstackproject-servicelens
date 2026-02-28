const authService = require("../services/auth.service");

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await authService.register(name, email, password);
    res.status(201).json({ message: "Account created", user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (requires auth middleware)
const me = async (req, res, next) => {
  try {
    const user = await authService.getById(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
