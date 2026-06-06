-- ============================================================
-- Inventory Management System — Supabase SQL Schema
-- Run this in the Supabase SQL Editor to create the tables.
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Items
CREATE TABLE IF NOT EXISTS items (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    description   TEXT,
    category_id   INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    quantity      INTEGER NOT NULL DEFAULT 0,
    unit          VARCHAR(50),           -- e.g. pcs, kg, box, litre
    unit_price    NUMERIC(12, 2),
    sku           VARCHAR(100) UNIQUE,
    location      VARCHAR(200),
    reorder_level INTEGER DEFAULT 0,
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_sku         ON items(sku);
CREATE INDEX IF NOT EXISTS idx_items_name        ON items(name);

-- ── Optional seed data ────────────────────────────────────────────────────────
-- Uncomment to pre-populate with sample categories and items.

-- INSERT INTO categories (name, description) VALUES
--   ('Electronics',  'Computers, phones, and other electronic devices'),
--   ('Furniture',    'Office chairs, desks, and storage units'),
--   ('Stationery',   'Pens, paper, notebooks, and office supplies'),
--   ('Networking',   'Switches, routers, cables, and access points'),
--   ('Peripherals',  'Monitors, keyboards, mice, and printers');
