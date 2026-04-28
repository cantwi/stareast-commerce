const productsModel = require("../models/productsModel");
const usersModel = require("../models/usersModel");

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function checkout({ userId, items, paymentMethod }) {
  const user = usersModel.findById(userId);
  if (!user) {
    throw badRequest("Unknown user");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw badRequest("items must be a non-empty array");
  }

  const normalizedPayment = (paymentMethod || "").toLowerCase();
  if (normalizedPayment !== "cash" && normalizedPayment !== "credit") {
    throw badRequest("paymentMethod must be cash or credit");
  }

  let subtotal = 0;
  const lineItems = items.map((it) => {
    const productId = it && it.productId;
    const quantity = Number(it && it.quantity);
    if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
      throw badRequest("Each item must have productId and quantity > 0");
    }

    const product = productsModel.findById(productId);
    if (!product) {
      throw badRequest(`Unknown productId: ${productId}`);
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal,
    };
  });

  const discountRate = normalizedPayment === "cash" ? 0.1 : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal - discount).toFixed(2));

  return {
    paymentMethod: normalizedPayment,
    discountRate,
    subtotal: Number(subtotal.toFixed(2)),
    discount,
    total,
    items: lineItems,
  };
}

module.exports = { checkout };

