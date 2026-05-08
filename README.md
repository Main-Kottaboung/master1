# master1
## Project overview

This project is a minimal, production-ready Express structure demonstrating:

- Modular structure: `routes`, `controllers`, `services`, `middlewares`, `config`, `utils`.
- Environment configuration via `dotenv` and `src/config`.
- Centralized error handling with `ApiError` and an error middleware.
- Security and logging middleware: `helmet`, `cors`, `morgan`.
- OpenAPI docs at `/api-docs` (Swagger UI).
- User CRUD with an in-memory mock database (`src/database/userDatabase.js`).
- Authentication: registration and login using `bcryptjs` and JWT (`jsonwebtoken`).
- Role-based authorization (admin/user) with middleware and an admin-only route.

## Project structure

```
src/
	├─ app.js                 # Express app, middleware, routes mount
	├─ index.js               # Server bootstrap
	├─ config/                # dotenv bootstrap and config values
	├─ routes/                # route definitions (auth, users, admin, profile, etc.)
	├─ controllers/           # route handlers
	├─ services/              # business logic (users, auth)
	├─ middlewares/           # auth, authorize, error handling
	├─ database/              # mock in-memory DB (for demos)
	└─ docs/                  # OpenAPI spec used by Swagger UI
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set values (at minimum `JWT_SECRET`).

3. Run in development:

```bash
npm run dev
```

4. Production:

```bash
npm start
```

## Docker

Run the app with Docker or Docker Compose:

```bash
docker build -t master1-api .
docker run --env-file .env -p 3000:3000 master1-api
```

Or use Compose for the app plus a PostgreSQL service scaffold:

```bash
docker compose up --build
```

## Environment

Current environment variables include:

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DATABASE_URL`
- `DATABASE_NAME`
- `DATABASE_DIALECT`

The database config is currently a scaffold for future persistent storage.

## Main endpoints

- Health: `GET /health` or `GET /api/health`
- Swagger UI: `GET /api-docs`

User CRUD (in `src/database` mock):
- `GET /api/users` — list users
- `GET /api/users/:id` — get user
- `POST /api/users` — create user (accepts optional `role`)
- `PUT /api/users/:id` — update user
- `DELETE /api/users/:id` — remove user

Authentication:
- `POST /api/auth/register` — register with JSON body `{ name, email, password, role? }` (returns `token`)
- `POST /api/auth/login` — login with `{ email, password }` (returns `token`)

Protected example:
- `GET /api/profile` — requires `Authorization: Bearer <token>`; returns current user

Role-based example:
- `GET /api/admin/users` — admin-only route protected by `authorize('admin')`

Notes:
- Passwords are hashed with `bcryptjs` on register.
- JWT settings are read from environment variables: `JWT_SECRET` and `JWT_EXPIRES_IN`.
- The current mock DB is in-memory; replace with a persistent store for production.

## Testing admin quickly

To test the admin route immediately you can register an admin:

```bash
POST /api/auth/register
{
	"name": "Admin User",
	"email": "admin@example.com",
	"password": "securepass",
	"role": "admin"
}
```

Then login and use the returned token as `Authorization: Bearer <token>` to call `GET /api/admin/users`.

## Next steps (suggested)

- Replace mock DB with a real database (Postgres, MongoDB).
- Add input validation (Joi/Zod) and stronger password rules.
- Add tests for auth, services and middleware.
- Add CI and Dockerfile for reproducible deployments.

If you want, I can add Swagger documentation for the auth and admin endpoints next.