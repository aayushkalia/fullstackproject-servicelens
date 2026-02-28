-- =============================================
-- ServiceLens Database Schema
-- Run this file once to set up your database:
--   psql -d servicelens -f db/schema.sql
-- =============================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          VARCHAR(10) NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'admin')),
    created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 3. PROVIDERS
CREATE TABLE IF NOT EXISTS providers (
    id           SERIAL PRIMARY KEY,
    category_id  INT NOT NULL REFERENCES categories(id),
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    city         VARCHAR(100) NOT NULL,
    address      TEXT,
    phone        VARCHAR(20),
    email        VARCHAR(255),
    website      VARCHAR(255),
    avg_rating   NUMERIC(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    is_approved  BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category_id);
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(avg_rating DESC);

-- 4. SERVICE PRICING
CREATE TABLE IF NOT EXISTS service_pricing (
    id           SERIAL PRIMARY KEY,
    provider_id  INT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    price        NUMERIC(10,2) NOT NULL,
    unit         VARCHAR(50) DEFAULT 'per visit',
    description  TEXT
);

CREATE INDEX IF NOT EXISTS idx_pricing_provider ON service_pricing(provider_id);
CREATE INDEX IF NOT EXISTS idx_pricing_price ON service_pricing(price);

-- 5. REVIEWS
CREATE TABLE IF NOT EXISTS provider_reviews (
    id          SERIAL PRIMARY KEY,
    provider_id INT NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(id),
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(provider_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider ON provider_reviews(provider_id);
