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
  ('77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333331', 'Gramercy Tavern', 'john@gramercy.com', '+12025551001', '12 Saad Zaghloul Square', 'Alexandria', 'Alexandria', '21519', 'EG', 'active', 4.80, 240, 2.99, 10, 20, 30),
  ('77777777-7777-7777-7777-777777777772', '33333333-3333-3333-3333-333333333332', 'Starbucks Borobudur', 'sarah@starbucks.com', '+12025551002', '24 Khaled Ibn El Walid Street, Sidi Bishr', 'Alexandria', 'Alexandria', '21624', 'EG', 'active', 4.90, 510, 1.99, 12, 25, 35),
  ('77777777-7777-7777-7777-777777777773', '33333333-3333-3333-3333-333333333333', 'Baegopa Suhat', 'mike@baegopa.com', '+12025551003', '18 Fouad Street, El Attarin', 'Alexandria', 'Alexandria', '21563', 'EG', 'active', 4.70, 180, 2.49, 10, 25, 35)
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

