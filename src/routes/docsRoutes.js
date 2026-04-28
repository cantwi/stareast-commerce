const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const router = express.Router();

const swaggerDocument = YAML.load(
  path.join(__dirname, "..", "..", "swagger.yaml")
);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;

