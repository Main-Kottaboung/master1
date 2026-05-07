# master1

## Project structure

Minimal scalable Express structure using modern JavaScript:

```
├─ src/
│  ├─ app.js                 # Express app (routes, middleware)
│  ├─ index.js               # Server bootstrap
│  ├─ config/                # Configuration (dotenv)
│  ├─ routes/                # Route definitions
│  ├─ controllers/           # Route handlers
│  ├─ services/              # Business logic / integrations
│  ├─ middlewares/           # Express middleware (error handling, auth)
│  └─ utils/                 # Utilities (ApiError, helpers)
├─ tests/                    # Unit / integration tests
├─ docs/                     # Documentation
├─ .env.example              # Example environment variables
├─ package.json
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and edit as needed.

3. Run in development:

```bash
npm run dev
```

4. Production:

```bash
npm start
```

## API examples

- Health check: `GET /health` (root) or `GET /api/health`
- Echo: `POST /api/echo` with JSON body — returns echoed payload

- API docs: `GET /api-docs` (Swagger UI)

If you want, I can add a CONTRIBUTING section, tests, or Dockerfile next.