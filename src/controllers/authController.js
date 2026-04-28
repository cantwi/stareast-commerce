const authService = require("../services/authService");

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body || {};
    const user = await authService.register({ email, password, name });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };

