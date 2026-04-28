const { expect } = require("chai");
const request = require("supertest");
const YAML = require("yamljs");
const path = require("path");
const net = require("net");
const { spawn } = require("child_process");

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForHealthy(baseUrl, { timeoutMs = 8000 } = {}) {
  const start = Date.now();
  // Poll until healthcheck succeeds or timeout.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await request(baseUrl).get("/healthcheck");
      if (res.status === 200) return;
    } catch (_) {
      // ignore until timeout
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error(`API did not become healthy within ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }
}

describe("Path coverage (Swagger) - Mocha + Supertest + Chai", function () {
  this.timeout(20000);

  const exercised = new Set();
  let serverProcess;
  let baseUrl;

  const swaggerPath = path.resolve(__dirname, "..", "..", "swagger.yaml");
  const swagger = YAML.load(swaggerPath);
  const allPaths = Object.keys(swagger.paths || {});

  before(async () => {
    const port = await getFreePort();
    baseUrl = `http://localhost:${port}`;

    serverProcess = spawn(process.execPath, ["src/server.js"], {
      cwd: path.resolve(__dirname, "..", ".."),
      env: {
        ...process.env,
        PORT: String(port),
        JWT_SECRET: process.env.JWT_SECRET || "test-secret",
      },
      stdio: "inherit",
    });

    await waitForHealthy(baseUrl, { timeoutMs: 12000 });
  });

  after(() => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill();
    }
  });

  after(() => {
    // Path coverage assertion: at least one request per Swagger path.
    const missing = allPaths.filter((p) => !exercised.has(p));
    expect(
      missing,
      `Missing coverage for paths: ${missing.join(", ")}`
    ).to.have.length(0);

    const coverage = allPaths.length
      ? exercised.size / allPaths.length
      : 1;
    expect(coverage, "Expected 100% path coverage").to.equal(1);
  });

  it("GET /healthcheck", async () => {
    const res = await request(baseUrl).get("/healthcheck");
    exercised.add("/healthcheck");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "ok");
  });

  it("POST /register", async () => {
    const uniqueEmail = `jane.${Date.now()}@example.com`;
    const res = await request(baseUrl)
      .post("/register")
      .send({ name: "Jane Doe", email: uniqueEmail, password: "password123" })
      .set("Content-Type", "application/json");

    exercised.add("/register");
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.include({ name: "Jane Doe", email: uniqueEmail });
  });

  it("POST /login", async () => {
    const res = await request(baseUrl)
      .post("/login")
      .send({ email: "alice@example.com", password: "password123" })
      .set("Content-Type", "application/json");

    exercised.add("/login");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token").that.is.a("string");
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.include({ email: "alice@example.com" });
  });

  it("POST /checkout (authenticated)", async () => {
    const loginRes = await request(baseUrl)
      .post("/login")
      .send({ email: "alice@example.com", password: "password123" })
      .set("Content-Type", "application/json");
    expect(loginRes.status).to.equal(200);
    const token = loginRes.body.token;

    const checkoutRes = await request(baseUrl)
      .post("/checkout")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .send({
        paymentMethod: "cash",
        items: [
          { productId: "p1", quantity: 2 },
          { productId: "p3", quantity: 1 },
        ],
      });

    exercised.add("/checkout");
    expect(checkoutRes.status).to.equal(200);
    expect(checkoutRes.body).to.have.property("paymentMethod", "cash");
    expect(checkoutRes.body).to.have.property("discountRate").that.is.a("number");
    expect(checkoutRes.body).to.have.property("total").that.is.a("number");
    expect(checkoutRes.body).to.have.property("items").that.is.an("array");
  });
});

