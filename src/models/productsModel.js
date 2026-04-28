// In-memory store. Seeded with 3 products.
const products = [
  { id: "p1", name: "T-Shirt", price: 20.0 },
  { id: "p2", name: "Coffee Mug", price: 12.5 },
  { id: "p3", name: "Sticker Pack", price: 5.0 }
];

function findById(id) {
  return products.find((p) => p.id === id);
}

function all() {
  return products.slice();
}

module.exports = { findById, all };

