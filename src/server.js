require("dotenv").config();

const { createApp } = require("./app");

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  // Keep it simple: single startup log.
  console.log(`API listening on port ${PORT}`);
});

