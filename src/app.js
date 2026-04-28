const express = require("express");

const routes = require("./routes");

function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/", routes);

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({
      error: {
        message: err.message || "Internal Server Error",
      },
    });
  });

  return app;
}

module.exports = { createApp };

