# ServiceLens – Service Cost Comparison Platform

A full-stack service cost comparison engine that lets users compare providers across healthcare, education, fitness, and more — by price, rating, and location.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt + RBAC (User/Admin)

## Features

- 🔍 Filter providers by category, city, price range, and rating
- 📊 Sort by price or rating with pagination
- ⭐ User reviews with denormalized ratings
- 🔐 JWT authentication with role-based access
- 🛠️ Admin dashboard — CRUD providers, manage pricing, approve listings

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/aayushkalia/fullstackproject-servicelens.git
cd fullstackproject-servicelens

# 2. Setup backend
cd server
cp .env.example .env        # Edit DATABASE_URL with your Postgres credentials
npm install

# 3. Create database and seed data
createdb servicelens
psql -d servicelens -f db/schema.sql
psql -d servicelens -f db/seed.sql

# 4. Start backend
npm run dev                  # Runs on http://localhost:3001

# 5. Setup frontend (new terminal)
cd ../client
npm install
npm run dev                  # Runs on http://localhost:5173
```

### Default Admin Login

```
Email:    admin@servicelens.com
Password: admin123
```

## API Endpoints

| Method | Route                              | Auth  | Description                |
| ------ | ---------------------------------- | ----- | -------------------------- |
| POST   | `/api/auth/register`               | —     | Register                   |
| POST   | `/api/auth/login`                  | —     | Login (returns JWT)        |
| GET    | `/api/auth/me`                     | User  | Get profile                |
| GET    | `/api/categories`                  | —     | List categories            |
| GET    | `/api/providers`                   | —     | Filter + sort + paginate   |
| GET    | `/api/providers/:id`               | —     | Provider detail + services |
| GET    | `/api/providers/:id/reviews`       | —     | Reviews list               |
| POST   | `/api/providers/:id/reviews`       | User  | Submit review              |
| POST   | `/api/admin/providers`             | Admin | Create provider            |
| PATCH  | `/api/admin/providers/:id`         | Admin | Edit provider              |
| DELETE | `/api/admin/providers/:id`         | Admin | Delete provider            |
| PATCH  | `/api/admin/providers/:id/approve` | Admin | Approve listing            |
| POST   | `/api/admin/services`              | Admin | Add service pricing        |
| PATCH  | `/api/admin/services/:id`          | Admin | Update price               |
| DELETE | `/api/admin/services/:id`          | Admin | Remove service             |

## Project Structure

```
server/
├── src/
│   ├── config/db.js
│   ├── middleware/   (auth, isAdmin, errorHandler)
│   ├── routes/       (auth, categories, providers, admin)
│   ├── controllers/  (auth, categories, providers, reviews, admin)
│   ├── services/     (auth, categories, providers, reviews, admin)
│   └── app.js
├── db/               (schema.sql, seed.sql)
└── server.js

client/
├── src/
│   ├── components/Navbar.jsx
│   ├── pages/        (Home, ProviderList, ProviderDetail, Login, Register, AdminDashboard)
│   ├── api.js
│   ├── AuthContext.jsx
│   └── App.jsx
```
