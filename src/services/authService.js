const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/usersModel");

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function unauthorized(message) {
  const err = new Error(message);
  err.statusCode = 401;
  return err;
}

async function register({ email, password, name }) {
  if (!email || !password || !name) {
    throw badRequest("email, password and name are required");
  }

  const existing = usersModel.findByEmail(email);
  if (existing) {
    throw badRequest("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = usersModel.create({ email, name, passwordHash });
  return usersModel.toPublicUser(user);
}

async function login({ email, password }) {
  if (!email || !password) {
    throw badRequest("email and password are required");
  }

  const user = usersModel.findByEmail(email);
  if (!user) {
    throw unauthorized("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw unauthorized("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "change-me",
    { expiresIn: "1h" }
  );

  return {
    token,
    user: usersModel.toPublicUser(user),
  };
}

module.exports = { register, login };

