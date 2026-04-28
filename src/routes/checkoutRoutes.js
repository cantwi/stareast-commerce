const express = require("express");

const checkoutController = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/checkout", requireAuth, checkoutController.checkout);

module.exports = router;

