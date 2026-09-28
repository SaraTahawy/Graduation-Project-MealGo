-- MealGo single-file DB initialization
-- Includes schema + seed + reporting views
-- Run:
--   psql -U postgres -d mealgo_db -f database/init.sql

-- =========================
-- 1) Schema
-- =========================
-- Food Delivery Platform Schema (PostgreSQL)
-- Designed from all current UI pages under src/pages/*

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
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'restaurant_status') THEN
    CREATE TYPE restaurant_status AS ENUM ('active', 'inactive', 'pending', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_status') THEN
    CREATE TYPE driver_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
    CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'address_label') THEN
    CREATE TYPE address_label AS ENUM ('home', 'work', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'pending',
      'preparing',
      'ready_for_delivery',
      'waiting_for_driver',
      'out_for_delivery',
      'delivered',
      'cancelled'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('card', 'cash', 'wallet', 'paypal', 'apple_pay');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'paid', 'failed', 'refunded', 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_discount_type') THEN
    CREATE TYPE coupon_discount_type AS ENUM ('percentage', 'fixed', 'free_delivery');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_status') THEN
    CREATE TYPE coupon_status AS ENUM ('active', 'inactive', 'expired');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coupon_scope') THEN
    CREATE TYPE coupon_scope AS ENUM ('all', 'new_users', 'restaurants', 'specific');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_category') THEN
    CREATE TYPE ticket_category AS ENUM ('order_issue', 'payment', 'delivery', 'account', 'technical', 'other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
    CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_assignment_status') THEN
    CREATE TYPE driver_assignment_status AS ENUM ('pending', 'accepted', 'rejected', 'timeout', 'cancelled');
  END IF;
END$$;

-- =========================
-- Core Identity
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label address_label NOT NULL DEFAULT 'other',
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(30),
  country_code CHAR(2) NOT NULL DEFAULT 'US',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_default_address
  ON user_addresses(user_id)
  WHERE is_default = true;

-- =========================
-- Restaurants & Menu
-- =========================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name VARCHAR(180) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(30),
  description TEXT,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(30),
  country_code CHAR(2) NOT NULL DEFAULT 'US',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  status restaurant_status NOT NULL DEFAULT 'pending',
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  eta_min_minutes INTEGER CHECK (eta_min_minutes >= 0),
  eta_max_minutes INTEGER CHECK (eta_max_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS restaurant_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  staff_role VARCHAR(50) NOT NULL DEFAULT 'manager',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (restaurant_id, user_id)
);

CREATE TABLE IF NOT EXISTS cuisines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS restaurant_cuisines (
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  cuisine_id UUID NOT NULL REFERENCES cuisines(id) ON DELETE CASCADE,
  PRIMARY KEY (restaurant_id, cuisine_id)
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (restaurant_id, name)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- =========================
-- Drivers
-- =========================
CREATE TABLE IF NOT EXISTS driver_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(50) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL UNIQUE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status driver_status NOT NULL DEFAULT 'pending',
  availability availability_status NOT NULL DEFAULT 'offline',
  current_latitude NUMERIC(10, 7),
  current_longitude NUMERIC(10, 7),
  current_location_text VARCHAR(255),
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  total_deliveries INTEGER NOT NULL DEFAULT 0 CHECK (total_deliveries >= 0),
  total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_earnings >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Orders, Delivery, Payment
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status order_status NOT NULL DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  service_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (service_fee >= 0),
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  item_count INTEGER NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  promo_code VARCHAR(60),
  coupon_id UUID,
  delivery_address_id UUID REFERENCES user_addresses(id) ON DELETE SET NULL,
  delivery_line1 VARCHAR(255) NOT NULL,
  delivery_line2 VARCHAR(255),
  delivery_city VARCHAR(100) NOT NULL,
  delivery_state VARCHAR(100),
  delivery_postal_code VARCHAR(30),
  delivery_country_code CHAR(2) NOT NULL DEFAULT 'US',
  delivery_latitude NUMERIC(10, 7),
  delivery_longitude NUMERIC(10, 7),
  delivery_notes TEXT,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  estimated_delivery_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  prepared_at TIMESTAMPTZ,
  out_for_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_reason TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name VARCHAR(160) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
  special_instructions TEXT
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS driver_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  driver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status driver_assignment_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  rejection_reason TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  provider VARCHAR(80),
  provider_txn_ref VARCHAR(120),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  is_cash_collected BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Coupons
-- =========================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(60) NOT NULL UNIQUE,
  description TEXT,
  discount_type coupon_discount_type NOT NULL,
  discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value >= 0),
  min_order_value NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
  max_discount NUMERIC(12, 2) CHECK (max_discount >= 0),
  usage_limit INTEGER CHECK (usage_limit >= 0),
  usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  status coupon_status NOT NULL DEFAULT 'active',
  applicable_for coupon_scope NOT NULL DEFAULT 'all',
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  /* NFT integration */
  nft_token_id TEXT,
  nft_contract_address TEXT,
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_coupon_dates CHECK (valid_until > valid_from)
);

CREATE TABLE IF NOT EXISTS coupon_restaurants (
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  PRIMARY KEY (coupon_id, restaurant_id)
);

CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  discount_amount NUMERIC(12, 2) NOT NULL CHECK (discount_amount >= 0)
);

ALTER TABLE orders
  ADD CONSTRAINT fk_order_coupon
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- =========================
-- Support
-- =========================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(30) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Reviews / Ratings
-- =========================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  food_rating SMALLINT CHECK (food_rating BETWEEN 1 AND 5),
  driver_rating SMALLINT CHECK (driver_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Platform Settings & Audit
-- =========================
CREATE TABLE IF NOT EXISTS platform_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  platform_name VARCHAR(120) NOT NULL DEFAULT 'MealGo',
  platform_email VARCHAR(255) NOT NULL DEFAULT 'support@mealgo.com',
  platform_phone VARCHAR(30),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  timezone VARCHAR(80) NOT NULL DEFAULT 'America/New_York',
  restaurant_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 15 CHECK (restaurant_commission_pct >= 0),
  delivery_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 10 CHECK (delivery_commission_pct >= 0),
  base_delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 2.99 CHECK (base_delivery_fee >= 0),
  delivery_fee_per_km NUMERIC(12, 2) NOT NULL DEFAULT 0.50 CHECK (delivery_fee_per_km >= 0),
  max_delivery_radius_km NUMERIC(8, 2) NOT NULL DEFAULT 10 CHECK (max_delivery_radius_km >= 0),
  min_order_amount NUMERIC(12, 2) NOT NULL DEFAULT 10 CHECK (min_order_amount >= 0),
  service_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.99 CHECK (service_fee >= 0),
  tax_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 8 CHECK (tax_rate_pct >= 0),
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  two_factor_auth BOOLEAN NOT NULL DEFAULT false,
  session_timeout_minutes INTEGER NOT NULL DEFAULT 30 CHECK (session_timeout_minutes > 0),
  updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ck_platform_settings_singleton CHECK (id = 1)
);

INSERT INTO platform_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  channel VARCHAR(30) NOT NULL DEFAULT 'in_app',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(120) NOT NULL,
  entity_name VARCHAR(80) NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_available ON menu_items(restaurant_id, is_available);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_status_availability ON driver_profiles(status, availability);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders(customer_id, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status_created ON orders(restaurant_id, status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_driver_status_created ON orders(assigned_driver_id, status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders(status, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order_created ON order_status_history(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_assignments_order_status ON driver_assignments(order_id, status);
CREATE INDEX IF NOT EXISTS idx_driver_assignments_driver_status ON driver_assignments(driver_user_id, status);
CREATE INDEX IF NOT EXISTS idx_coupons_status_dates ON coupons(status, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user_coupon ON coupon_redemptions(user_id, coupon_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status_priority_created ON support_tickets(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_created ON support_ticket_messages(ticket_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);

COMMIT;




-- =========================
-- 2) Seed
-- =========================
-- Seed data for Food Delivery Platform
-- Run after 001_schema.sql

BEGIN;

-- =========================
-- Users
-- =========================
INSERT INTO users (id, full_name, email, phone, password_hash, role, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'System Admin', 'admin@mealgo.com', '+12025550001', 'seed_hash_admin', 'admin', 'active'),
  ('22222222-2222-2222-2222-222222222221', 'Support Agent 1', 'support1@mealgo.com', '+12025550002', 'seed_hash_support1', 'support', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'Support Agent 2', 'support2@mealgo.com', '+12025550003', 'seed_hash_support2', 'support', 'active'),

  ('33333333-3333-3333-3333-333333333331', 'John Smith', 'john@gramercy.com', '+12025550010', 'seed_hash_rest_owner1', 'restaurant', 'active'),
  ('33333333-3333-3333-3333-333333333332', 'Sarah Johnson', 'sarah@starbucks.com', '+12025550011', 'seed_hash_rest_owner2', 'restaurant', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'Mike Brown', 'mike@baegopa.com', '+12025550012', 'seed_hash_rest_owner3', 'restaurant', 'active'),

  ('44444444-4444-4444-4444-444444444441', 'John Driver', 'john.driver@example.com', '+12025550020', 'seed_hash_driver1', 'driver', 'active'),
  ('44444444-4444-4444-4444-444444444442', 'Mike Rider', 'mike.rider@example.com', '+12025550021', 'seed_hash_driver2', 'driver', 'active'),
  ('44444444-4444-4444-4444-444444444443', 'Tom Wilson', 'tom.wilson@example.com', '+12025550022', 'seed_hash_driver3', 'driver', 'inactive'),

  ('55555555-5555-5555-5555-555555555551', 'Ahmad Ali', 'ahmad@example.com', '+12025550030', 'seed_hash_customer1', 'customer', 'active'),
  ('55555555-5555-5555-5555-555555555552', 'Sarah Khan', 'sarah@example.com', '+12025550031', 'seed_hash_customer2', 'customer', 'active'),
  ('55555555-5555-5555-5555-555555555553', 'Mike Brown C', 'mike.customer@example.com', '+12025550032', 'seed_hash_customer3', 'customer', 'active'),
  ('55555555-5555-5555-5555-555555555554', 'Lisa Wong', 'lisa@example.com', '+12025550033', 'seed_hash_customer4', 'customer', 'active')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Addresses
-- =========================
INSERT INTO user_addresses (id, user_id, label, line1, city, state, postal_code, country_code, is_default)
VALUES
  ('66666666-6666-6666-6666-666666666551', '55555555-5555-5555-5555-555555555551', 'home', '123 Main Street, Apt 4B', 'New York', 'NY', '10001', 'US', true),
  ('66666666-6666-6666-6666-666666666552', '55555555-5555-5555-5555-555555555552', 'home', '45 Madison Ave', 'New York', 'NY', '10010', 'US', true),
  ('66666666-6666-6666-6666-666666666553', '55555555-5555-5555-5555-555555555553', 'home', '89 Broadway', 'New York', 'NY', '10012', 'US', true),
  ('66666666-6666-6666-6666-666666666554', '55555555-5555-5555-5555-555555555554', 'home', '77 Wall Street', 'New York', 'NY', '10005', 'US', true)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Restaurants
-- =========================
INSERT INTO restaurants (
  id, owner_user_id, name, email, phone, address_line1, city, state, postal_code, country_code,
  status, rating_avg, rating_count, delivery_fee, min_order_amount, eta_min_minutes, eta_max_minutes
)
VALUES
  ('77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333331', 'Gramercy Tavern', 'john@gramercy.com', '+12025551001', '10 E 20th St', 'New York', 'NY', '10003', 'US', 'active', 4.80, 240, 2.99, 10, 20, 30),
  ('77777777-7777-7777-7777-777777777772', '33333333-3333-3333-3333-333333333332', 'Starbucks Borobudur', 'sarah@starbucks.com', '+12025551002', '200 5th Ave', 'New York', 'NY', '10010', 'US', 'active', 4.90, 510, 1.99, 12, 25, 35),
  ('77777777-7777-7777-7777-777777777773', '33333333-3333-3333-3333-333333333333', 'Baegopa Suhat', 'mike@baegopa.com', '+12025551003', '88 W 3rd St', 'New York', 'NY', '10012', 'US', 'active', 4.70, 180, 2.49, 10, 25, 35)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Cuisines
-- =========================
INSERT INTO cuisines (id, name)
VALUES
  ('88888888-8888-8888-8888-888888888801', 'Italian'),
  ('88888888-8888-8888-8888-888888888802', 'American'),
  ('88888888-8888-8888-8888-888888888803', 'Pizza'),
  ('88888888-8888-8888-8888-888888888804', 'Coffee'),
  ('88888888-8888-8888-8888-888888888805', 'Korean')
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant_cuisines (restaurant_id, cuisine_id)
VALUES
  ('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888801'),
  ('77777777-7777-7777-7777-777777777771', '88888888-8888-8888-8888-888888888803'),
  ('77777777-7777-7777-7777-777777777772', '88888888-8888-8888-8888-888888888804'),
  ('77777777-7777-7777-7777-777777777773', '88888888-8888-8888-8888-888888888805')
ON CONFLICT DO NOTHING;

-- =========================
-- Menu categories and items
-- =========================
INSERT INTO menu_categories (id, restaurant_id, name, sort_order)
VALUES
  ('99999999-9999-9999-9999-999999999901', '77777777-7777-7777-7777-777777777771', 'Pizza', 1),
  ('99999999-9999-9999-9999-999999999902', '77777777-7777-7777-7777-777777777771', 'Pasta', 2),
  ('99999999-9999-9999-9999-999999999903', '77777777-7777-7777-7777-777777777772', 'Coffee', 1),
  ('99999999-9999-9999-9999-999999999904', '77777777-7777-7777-7777-777777777773', 'Korean', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, image_url, rating_avg, rating_count, is_available)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', '77777777-7777-7777-7777-777777777771', '99999999-9999-9999-9999-999999999901', 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, basil', 12.99, 'https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.80, 120, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', '77777777-7777-7777-7777-777777777771', '99999999-9999-9999-9999-999999999901', 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 14.99, 'https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.80, 90, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', '77777777-7777-7777-7777-777777777771', '99999999-9999-9999-9999-999999999902', 'Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 13.99, 'https://images.unsplash.com/photo-1722587965667-80edfe0fe388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', 4.70, 80, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', '77777777-7777-7777-7777-777777777772', '99999999-9999-9999-9999-999999999903', 'Cappuccino', 'Espresso with steamed milk foam', 5.50, null, 4.90, 200, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', '77777777-7777-7777-7777-777777777773', '99999999-9999-9999-9999-999999999904', 'Kimchi Fried Rice', 'Spicy Korean fried rice with egg', 11.50, null, 4.60, 60, true)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Drivers
-- =========================
INSERT INTO driver_profiles (
  user_id, vehicle_type, vehicle_number, status, availability, current_location_text,
  rating_avg, rating_count, total_deliveries, total_earnings
)
VALUES
  ('44444444-4444-4444-4444-444444444441', 'Motorcycle', 'B-1234-CD', 'active', 'available', 'Sudirman, Jakarta', 4.80, 200, 234, 2540),
  ('44444444-4444-4444-4444-444444444442', 'Motorcycle', 'B-5678-EF', 'active', 'busy', 'Thamrin, Jakarta', 4.90, 160, 189, 1890),
  ('44444444-4444-4444-4444-444444444443', 'Car', 'B-9012-GH', 'inactive', 'offline', null, 4.50, 70, 56, 680)
ON CONFLICT (user_id) DO NOTHING;

-- =========================
-- Coupons
-- =========================
INSERT INTO coupons (
  id, code, description, discount_type, discount_value, min_order_value, max_discount,
  usage_limit, usage_count, status, applicable_for, valid_from, valid_until, created_by_user_id
)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001', 'WELCOME20', '20% off for new users', 'percentage', 20, 10, 10, 1000, 543, 'active', 'new_users', now() - interval '30 days', now() + interval '180 days', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', 'SAVE5', '$5 off on orders above $25', 'fixed', 5, 25, null, 500, 234, 'active', 'all', now() - interval '20 days', now() + interval '120 days', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003', 'FREESHIP', 'Free delivery', 'free_delivery', 2.99, 0, null, 5000, 3245, 'active', 'all', now() - interval '10 days', now() + interval '90 days', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Orders + items + status history + payments
-- =========================
INSERT INTO orders (
  id, order_number, customer_id, restaurant_id, assigned_driver_id, status, payment_method, payment_status,
  subtotal, delivery_fee, service_fee, tax_amount, discount_amount, total_amount, item_count,
  promo_code, coupon_id, delivery_address_id, delivery_line1, delivery_city, delivery_state, delivery_postal_code, delivery_country_code,
  placed_at, estimated_delivery_at, out_for_delivery_at
)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-ccccccccc001', 'ORD-2451',
    '55555555-5555-5555-5555-555555555551', '77777777-7777-7777-7777-777777777771',
    '44444444-4444-4444-4444-444444444441', 'preparing', 'card', 'authorized',
    24.50, 2.99, 0.99, 2.25, 0, 30.73, 3,
    null, null, '66666666-6666-6666-6666-666666666551',
    '123 Main Street, Apt 4B', 'New York', 'NY', '10001', 'US',
    now() - interval '25 minutes', now() + interval '20 minutes', null
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccc002', 'ORD-2450',
    '55555555-5555-5555-5555-555555555552', '77777777-7777-7777-7777-777777777772',
    '44444444-4444-4444-4444-444444444442', 'out_for_delivery', 'cash', 'pending',
    18.99, 1.99, 0.99, 1.76, 0, 23.73, 2,
    null, null, '66666666-6666-6666-6666-666666666552',
    '45 Madison Ave', 'New York', 'NY', '10010', 'US',
    now() - interval '40 minutes', now() + interval '10 minutes', now() - interval '8 minutes'
  ),
  (
    'cccccccc-cccc-cccc-cccc-ccccccccc003', 'ORD-2449',
    '55555555-5555-5555-5555-555555555553', '77777777-7777-7777-7777-777777777773',
    null, 'ready_for_delivery', 'wallet', 'paid',
    32.50, 2.49, 0.99, 2.88, 5.00, 33.86, 5,
    'SAVE5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', '66666666-6666-6666-6666-666666666553',
    '89 Broadway', 'New York', 'NY', '10012', 'US',
    now() - interval '55 minutes', now() + interval '5 minutes', null
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, menu_item_id, item_name, unit_price, quantity, line_total)
VALUES
  ('dddddddd-dddd-dddd-dddd-ddddddddd001', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001', 'Margherita Pizza', 12.99, 1, 12.99),
  ('dddddddd-dddd-dddd-dddd-ddddddddd002', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002', 'Pepperoni Pizza', 14.99, 1, 14.99),
  ('dddddddd-dddd-dddd-dddd-ddddddddd003', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004', 'Cappuccino', 5.50, 2, 11.00),
  ('dddddddd-dddd-dddd-dddd-ddddddddd004', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003', 'Pasta Carbonara', 13.99, 1, 13.99),
  ('dddddddd-dddd-dddd-dddd-ddddddddd005', 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005', 'Kimchi Fried Rice', 11.50, 2, 23.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_status_history (id, order_id, status, changed_by_user_id, note, created_at)
VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeee001', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'pending', '33333333-3333-3333-3333-333333333331', 'Order created', now() - interval '25 minutes'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeee002', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'preparing', '33333333-3333-3333-3333-333333333331', 'Kitchen started', now() - interval '20 minutes'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeee003', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'pending', '33333333-3333-3333-3333-333333333332', 'Order created', now() - interval '40 minutes'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeee004', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'out_for_delivery', '44444444-4444-4444-4444-444444444442', 'Driver picked up', now() - interval '8 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO driver_assignments (id, order_id, driver_user_id, status, requested_at, responded_at)
VALUES
  ('ffffffff-ffff-ffff-ffff-fffffffff001', 'cccccccc-cccc-cccc-cccc-ccccccccc001', '44444444-4444-4444-4444-444444444441', 'accepted', now() - interval '22 minutes', now() - interval '21 minutes'),
  ('ffffffff-ffff-ffff-ffff-fffffffff002', 'cccccccc-cccc-cccc-cccc-ccccccccc002', '44444444-4444-4444-4444-444444444442', 'accepted', now() - interval '20 minutes', now() - interval '19 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (id, order_id, method, status, amount, currency, is_cash_collected, paid_at)
VALUES
  ('12121212-1212-1212-1212-121212121201', 'cccccccc-cccc-cccc-cccc-ccccccccc001', 'card', 'authorized', 30.73, 'USD', false, null),
  ('12121212-1212-1212-1212-121212121202', 'cccccccc-cccc-cccc-cccc-ccccccccc002', 'cash', 'pending', 23.73, 'USD', false, null),
  ('12121212-1212-1212-1212-121212121203', 'cccccccc-cccc-cccc-cccc-ccccccccc003', 'wallet', 'paid', 33.86, 'USD', false, now() - interval '50 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO coupon_redemptions (id, coupon_id, user_id, order_id, discount_amount)
VALUES
  ('13131313-1313-1313-1313-131313131301', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002', '55555555-5555-5555-5555-555555555553', 'cccccccc-cccc-cccc-cccc-ccccccccc003', 5.00)
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Support tickets
-- =========================
INSERT INTO support_tickets (
  id, ticket_number, subject, customer_id, order_id, category, priority, status, assigned_to_user_id, created_at, updated_at
)
VALUES
  (
    '14141414-1414-1414-1414-141414141401', 'TKT-1234', 'Order not delivered',
    '55555555-5555-5555-5555-555555555551', 'cccccccc-cccc-cccc-cccc-ccccccccc001',
    'delivery', 'high', 'open', null, now() - interval '2 hours', now() - interval '30 minutes'
  ),
  (
    '14141414-1414-1414-1414-141414141402', 'TKT-1233', 'Payment failed but amount deducted',
    '55555555-5555-5555-5555-555555555552', 'cccccccc-cccc-cccc-cccc-ccccccccc002',
    'payment', 'urgent', 'in_progress', '22222222-2222-2222-2222-222222222221', now() - interval '5 hours', now() - interval '1 hour'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO support_ticket_messages (id, ticket_id, sender_user_id, message, created_at)
VALUES
  ('15151515-1515-1515-1515-151515151501', '14141414-1414-1414-1414-141414141401', '55555555-5555-5555-5555-555555555551', 'I did not receive my order yet.', now() - interval '2 hours'),
  ('15151515-1515-1515-1515-151515151502', '14141414-1414-1414-1414-141414141402', '22222222-2222-2222-2222-222222222221', 'We are checking your transaction with the payment provider.', now() - interval '1 hour')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Reviews
-- =========================
INSERT INTO reviews (id, order_id, customer_id, restaurant_id, driver_id, food_rating, driver_rating, comment)
VALUES
  ('16161616-1616-1616-1616-161616161601', 'cccccccc-cccc-cccc-cccc-ccccccccc003', '55555555-5555-5555-5555-555555555553', '77777777-7777-7777-7777-777777777773', null, 5, null, 'Great taste and fast preparation')
ON CONFLICT (id) DO NOTHING;

-- =========================
-- Platform settings
-- =========================
UPDATE platform_settings
SET
  platform_name = 'MealGo',
  platform_email = 'support@mealgo.com',
  platform_phone = '+12025550001',
  currency = 'USD',
  timezone = 'America/New_York',
  restaurant_commission_pct = 15,
  delivery_commission_pct = 10,
  base_delivery_fee = 2.99,
  delivery_fee_per_km = 0.50,
  max_delivery_radius_km = 10,
  min_order_amount = 10,
  service_fee = 0.99,
  tax_rate_pct = 8,
  email_notifications = true,
  sms_notifications = false,
  push_notifications = true,
  two_factor_auth = false,
  session_timeout_minutes = 30,
  updated_by_user_id = '11111111-1111-1111-1111-111111111111',
  updated_at = now()
WHERE id = 1;

COMMIT;




-- =========================
-- 3) Reporting Views
-- =========================
-- Reporting Views for Admin dashboard and reports
-- Run after 001_schema.sql (and optionally after 002_seed.sql)

BEGIN;

-- =========================
-- KPI snapshot
-- =========================
CREATE OR REPLACE VIEW vw_admin_kpi_snapshot AS
SELECT
  (SELECT COALESCE(SUM(total_amount), 0)
   FROM orders
   WHERE status = 'delivered') AS total_revenue,
  (SELECT COUNT(*) FROM orders) AS total_orders,
  (SELECT COUNT(*) FROM users WHERE role = 'customer' AND status = 'active') AS active_customers,
  (SELECT COUNT(*) FROM users WHERE role = 'driver' AND status = 'active') AS active_drivers,
  (SELECT AVG(EXTRACT(EPOCH FROM (delivered_at - placed_at))/60.0)
   FROM orders
   WHERE status = 'delivered' AND delivered_at IS NOT NULL) AS avg_delivery_minutes;

-- =========================
-- Daily revenue and orders
-- =========================
CREATE OR REPLACE VIEW vw_daily_revenue_orders AS
SELECT
  date_trunc('day', placed_at)::date AS day,
  COUNT(*)::int AS orders_count,
  COALESCE(SUM(total_amount), 0)::numeric(12,2) AS gross_amount,
  COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END), 0)::numeric(12,2) AS delivered_amount
FROM orders
GROUP BY 1
ORDER BY 1 DESC;

-- =========================
-- Orders management list
-- =========================
CREATE OR REPLACE VIEW vw_admin_orders AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.payment_method,
  o.payment_status,
  o.item_count,
  o.total_amount,
  o.placed_at,
  o.estimated_delivery_at,
  cu.full_name AS customer_name,
  cu.email AS customer_email,
  r.name AS restaurant_name,
  dr.full_name AS driver_name,
  o.delivery_line1,
  o.delivery_city,
  o.delivery_state,
  o.delivery_postal_code
FROM orders o
JOIN users cu ON cu.id = o.customer_id
JOIN restaurants r ON r.id = o.restaurant_id
LEFT JOIN users dr ON dr.id = o.assigned_driver_id;

-- =========================
-- Restaurants stats
-- =========================
CREATE OR REPLACE VIEW vw_admin_restaurants_stats AS
SELECT
  r.id,
  r.name,
  r.status,
  r.rating_avg,
  r.rating_count,
  COUNT(o.id)::int AS orders_count,
  COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount ELSE 0 END), 0)::numeric(12,2) AS delivered_revenue
FROM restaurants r
LEFT JOIN orders o ON o.restaurant_id = r.id
GROUP BY r.id, r.name, r.status, r.rating_avg, r.rating_count;

-- =========================
-- Drivers stats
-- =========================
CREATE OR REPLACE VIEW vw_admin_drivers_stats AS
SELECT
  u.id AS driver_user_id,
  u.full_name AS driver_name,
  u.email,
  u.phone,
  dp.status,
  dp.availability,
  dp.vehicle_type,
  dp.vehicle_number,
  dp.rating_avg,
  dp.total_deliveries,
  dp.total_earnings
FROM driver_profiles dp
JOIN users u ON u.id = dp.user_id;

-- =========================
-- Coupon stats
-- =========================
CREATE OR REPLACE VIEW vw_admin_coupons_stats AS
SELECT
  c.id,
  c.code,
  c.status,
  c.discount_type,
  c.discount_value,
  c.min_order_value,
  c.max_discount,
  c.usage_limit,
  c.usage_count,
  c.valid_from,
  c.valid_until,
  COUNT(cr.id)::int AS redemption_rows,
  COALESCE(SUM(cr.discount_amount), 0)::numeric(12,2) AS total_discount_given
FROM coupons c
LEFT JOIN coupon_redemptions cr ON cr.coupon_id = c.id
GROUP BY
  c.id, c.code, c.status, c.discount_type, c.discount_value, c.min_order_value,
  c.max_discount, c.usage_limit, c.usage_count, c.valid_from, c.valid_until;

-- =========================
-- Support tickets stats
-- =========================
CREATE OR REPLACE VIEW vw_admin_support_tickets AS
SELECT
  t.id,
  t.ticket_number,
  t.subject,
  t.category,
  t.priority,
  t.status,
  t.created_at,
  t.updated_at,
  cu.full_name AS customer_name,
  cu.email AS customer_email,
  ag.full_name AS assigned_to_name,
  COALESCE(msg.msg_count, 0)::int AS messages_count
FROM support_tickets t
JOIN users cu ON cu.id = t.customer_id
LEFT JOIN users ag ON ag.id = t.assigned_to_user_id
LEFT JOIN (
  SELECT ticket_id, COUNT(*) AS msg_count
  FROM support_ticket_messages
  GROUP BY ticket_id
) msg ON msg.ticket_id = t.id;

-- =========================
-- Customer order history
-- =========================
CREATE OR REPLACE VIEW vw_customer_order_history AS
SELECT
  o.customer_id,
  o.id AS order_id,
  o.order_number,
  o.status,
  o.total_amount,
  o.item_count,
  o.placed_at,
  r.name AS restaurant_name,
  o.delivery_line1,
  o.delivery_city,
  o.delivery_state
FROM orders o
JOIN restaurants r ON r.id = o.restaurant_id
ORDER BY o.placed_at DESC;

COMMIT;

