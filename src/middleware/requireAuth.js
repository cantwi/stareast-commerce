const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: { message: "Missing or invalid Authorization header" },
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "change-me");
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
}

module.exports = { requireAuth };

