const checkoutService = require("../services/checkoutService");

async function checkout(req, res, next) {
  try {
    const { items, paymentMethod } = req.body || {};
    const result = await checkoutService.checkout({
      userId: req.user.userId,
      items,
      paymentMethod,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { checkout };

