# StarEast Commerce API

## Description
Simple REST API for an e-commerce checkout flow built with **JavaScript + Express**.
It runs fully **in memory** (no database) and supports **JWT authentication**.

## Installation
```bash
npm install
```

## How to Run
1. Create a `.env` file (or set environment variables):
   - Copy `.env.example` to `.env`
   - Set `JWT_SECRET` to any value
2. Start the API:
```bash
npm run dev
```
The API defaults to `PORT=3000`.

## Rules
- The API has **only 4 endpoints**:
  - `POST /register`
  - `POST /login`
  - `POST /checkout`
  - `GET /healthcheck`
- Checkout rules:
  - Checkout accepts only **cash** or **credit**
  - **cash** gives **10% discount**
  - Only **authenticated** users can checkout (JWT required)
- Everything runs **in memory** (no database)
- Swagger UI is available at `GET /docs` and loads `swagger.yaml`

## Data Already Existent
### Seed users (already in memory)
All seeded users have password: `password123`
- Alice: `alice@example.com`
- Bob: `bob@example.com`
- Carol: `carol@example.com`

### Seed products (already in memory)
- `p1` T-Shirt — 20.00
- `p2` Coffee Mug — 12.50
- `p3` Sticker Pack — 5.00

## How to Use the Rest API
### 1) Healthcheck
```bash
curl http://localhost:3000/healthcheck
```

### 2) Login (get JWT)
```bash
curl -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

### 3) Checkout (requires JWT)
Use the token from `/login` as `Authorization: Bearer <token>`.

Cash (10% discount):
```bash
curl -X POST http://localhost:3000/checkout ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"paymentMethod\":\"cash\",\"items\":[{\"productId\":\"p1\",\"quantity\":2},{\"productId\":\"p3\",\"quantity\":1}]}"
```

Credit (no discount):
```bash
curl -X POST http://localhost:3000/checkout ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"paymentMethod\":\"credit\",\"items\":[{\"productId\":\"p2\",\"quantity\":1}]}"
```

### 4) Register
```bash
curl -X POST http://localhost:3000/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

### Swagger
Open Swagger UI at `http://localhost:3000/docs`.

