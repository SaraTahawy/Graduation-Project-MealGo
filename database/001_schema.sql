-- =========================
-- Start transaction
-- =========================
BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- Enums
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('customer', 'driver', 'restaurant', 'admin', 'support');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
  END IF;
  -- Add all other enums similarly...
END$$;

-- =========================
-- Tables (IF NOT EXISTS)
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ... كل الجداول زي ما موجودة في السكريبت الأصلي ...

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  coupon_id UUID,
  delivery_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL
  -- باقي الأعمدة زي الأصل
);

-- =========================
-- Constraints آمنة
-- =========================
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_name='orders'
        AND constraint_name='fk_order_coupon'
   ) THEN
      ALTER TABLE orders
        ADD CONSTRAINT fk_order_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;
   END IF;
END
$$;

-- =========================
-- باقي السكريبت: Indexes, Settings, Audit, Notifications...
-- =========================
-- استخدمي CREATE INDEX IF NOT EXISTS لكل index
-- INSERT INTO platform_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

COMMIT;
