const bcrypt = require("bcryptjs");

// In-memory store. Seeded with 3 users (password: "password123" for all).
const users = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
  },
  {
    id: "u2",
    name: "Bob Smith",
    email: "bob@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
  },
  {
    id: "u3",
    name: "Carol Davis",
    email: "carol@example.com",
    passwordHash: bcrypt.hashSync("password123", 10),
  },
];

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function findByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function create({ email, name, passwordHash }) {
  const id = `u${users.length + 1}`;
  const user = { id, email, name, passwordHash };
  users.push(user);
  return user;
}

function allPublic() {
  return users.map(toPublicUser);
}

module.exports = { toPublicUser, findByEmail, findById, create, allPublic };

