# Authentication Architecture Guide

## Overview

This document explains the authentication middleware patterns and how to use them for building scalable, secure routes.

---

## Middleware Patterns

### 1. `requireAuth` — Enforce Authentication
**File:** `src/middlewares/requireAuth.js`

**When to use:** Routes that MUST have a valid JWT token

**Behavior:**
- Returns 401 if no token provided
- Returns 401 if token is invalid/expired
- Returns 401 if user not found in database
- Attaches `req.user` to request on success

**Example:**
```javascript
const requireAuth = require('../middlewares/requireAuth');

router.get('/profile', requireAuth, (req, res) => {
  res.json({ data: req.user });
});
```

---

### 2. `optionalAuth` — Try Authentication (Don't Fail)
**File:** `src/middlewares/optionalAuth.js`

**When to use:** Routes that work for both logged-in and guest users, but personalize for logged-in users

**Behavior:**
- Does NOT fail if token is missing
- Does NOT fail if token is invalid
- Attaches `req.user` only if token is valid
- Always calls `next()`

**Example (future use):**
```javascript
const optionalAuth = require('../middlewares/optionalAuth');

router.get('/products', optionalAuth, (req, res) => {
  // Personalize results if req.user exists
  const filters = req.user ? { userId: req.user.id } : {};
  // ... fetch products with filters
});
```

---

### 3. `requireRole` — Role-Based Authorization
**File:** `src/middlewares/requireRole.js`

**When to use:** Routes restricted to specific roles (admin, moderator, etc.)

**Behavior:**
- MUST be used AFTER `requireAuth` (assumes `req.user` exists)
- Returns 403 if user role doesn't match allowed roles
- Supports single role: `requireRole('admin')`
- Supports multiple roles: `requireRole('admin', 'moderator')`

**Example:**
```javascript
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');

// Admin only
router.get('/admin/users', requireAuth, requireRole('admin'), handler);

// Admin or moderator
router.get('/admin/reports', requireAuth, requireRole('admin', 'moderator'), handler);
```

---

## Route Protection Strategy

### Public Routes (No Middleware)
```
POST /api/auth/register     — Anyone can sign up
POST /api/auth/login        — Anyone can log in
```

### User Routes (Currently Public, Recommended to Protect)
```
GET  /api/users             — Currently: Public (list all users)
GET  /api/users/:id         — Currently: Public (get user)
POST /api/users             — Currently: Public (create user as admin)
PUT  /api/users/:id         — Currently: Public (update user as admin)
DELETE /api/users/:id       — Currently: Public (delete user as admin)

RECOMMENDED: Add requireAuth + requireRole('admin') to all /api/users routes
```

### Protected Routes (JWT Required)
```
GET /api/profile            — Protected: Get own profile
```

### Admin Routes (JWT + Admin Role Required)
```
GET /api/admin/users        — Protected: Admin-only list of all users
```

---

## Middleware Chain Order

When combining middlewares, always apply in this order:

```javascript
1. Validation middleware  (e.g., validateRegister)
2. Authentication        (e.g., requireAuth)
3. Authorization         (e.g., requireRole)
4. Route handler
```

**Example:**
```javascript
router.post(
  '/api/users',
  validateCreateUser,      // 1. Validate input
  requireAuth,             // 2. Check JWT token
  requireRole('admin'),    // 3. Check role
  userController.create    // 4. Handle request
);
```

---

## Current Architecture

```
/api
├── /auth
│   ├── POST /register    (PUBLIC)
│   └── POST /login       (PUBLIC)
├── /profile
│   └── GET  /            (PROTECTED: requireAuth)
├── /users
│   ├── GET  /            (PUBLIC - consider protecting)
│   ├── GET  /:id         (PUBLIC - consider protecting)
│   ├── POST /            (PUBLIC - consider protecting)
│   ├── PUT  /:id         (PUBLIC - consider protecting)
│   └── DELETE /:id       (PUBLIC - consider protecting)
└── /admin
    └── GET  /users       (PROTECTED: requireAuth + requireRole('admin'))
```

---

## Future Ecommerce Roles

The architecture supports role-based authorization for future features:

```javascript
// Customer dashboard
router.get('/customer/orders', requireAuth, requireRole('user'), handler);

// Admin panel
router.get('/admin/orders', requireAuth, requireRole('admin'), handler);

// Moderator moderation tools
router.get('/moderator/reports', requireAuth, requireRole('moderator'), handler);

// Multi-role access
router.get('/dashboard', requireAuth, requireRole('admin', 'moderator', 'user'), handler);
```

---

## Error Responses

| Middleware | Status | Response |
|-----------|--------|----------|
| `requireAuth` missing token | 401 | `"Authorization required"` |
| `requireAuth` invalid token | 401 | `"Invalid or expired token"` |
| `requireAuth` user not found | 401 | `"User not found"` |
| `requireRole` wrong role | 403 | `"Access denied. Required role: admin"` |
| Validation error | 400 | Field-specific validation message |

---

## Testing Routes

```bash
# Public: Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@ex.com","password":"123456"}'

# Public: Login (get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ex.com","password":"123456"}'

# Protected: Get profile (requires token)
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Admin: List all users (requires token + admin role)
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

---

## Migration Guide (If Protecting User Routes)

To enable admin protection on user routes, update `src/routes/userRoutes.js`:

```javascript
const requireAuth = require('../middlewares/requireAuth');
const requireRole = require('../middlewares/requireRole');

// Update routes to:
router.get('/', requireAuth, requireRole('admin'), userController.getUsers);
router.get('/:id', requireAuth, requireRole('admin'), userController.getUser);
router.post('/', validateCreateUser, requireAuth, requireRole('admin'), userController.createUser);
router.put('/:id', validateUpdateUser, requireAuth, requireRole('admin'), userController.updateUser);
router.delete('/:id', requireAuth, requireRole('admin'), userController.deleteUser);
```

---

## Debugging Authentication Issues

**Problem: Getting 401 on login (public route)**
- Check: Is the password correct?
- Check: Does the user exist in database?
- Check: Are CORS headers set correctly?
- Check: Is the frontend sending JSON with correct field names?

**Problem: Getting 401 on protected route**
- Check: Is token included in `Authorization: Bearer <token>` header?
- Check: Is token not expired? (JWT_EXPIRES_IN in .env)
- Check: Is the user still in the database?

**Problem: Getting 403 on admin route**
- Check: Is user's `role` field set to 'admin' in database?
- Check: Are you using `requireAuth` BEFORE `requireRole`?

---

## Summary

- Use `requireAuth` for protected routes
- Use `optionalAuth` for personalized public routes (future)
- Use `requireRole` after `requireAuth` for admin/role-based routes
- All auth/login routes are public
- Profile route is protected
- Admin routes require auth + admin role
- User routes are currently public (recommended to protect)

