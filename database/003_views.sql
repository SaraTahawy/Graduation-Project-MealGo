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
