function healthcheck(req, res) {
  res.json({ status: "ok" });
}

module.exports = { healthcheck };

