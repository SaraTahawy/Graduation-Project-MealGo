# Database Coverage Map (UI -> Tables)

This schema is built from all pages in `src/pages/*`.

## Quick Start (Local PostgreSQL, no Docker)
1. Create DB:
`createdb -U postgres mealgo_db`
2. Run one file:
`psql -U postgres -d mealgo_db -f database/init.sql`
3. Verify:
`psql -U postgres -d mealgo_db -c "\dt"`
`psql -U postgres -d mealgo_db -c "\dv"`

## Auth / Users
- `SignIn.tsx`, `SignUp.tsx`, `CustomerLogin.tsx`, `Profile.tsx`, `AdminUsers.tsx`
- Tables:
`users`, `user_addresses`, `notifications`, `audit_logs`

## Customer Ordering / Checkout / Orders
- `CustomerOrdering.tsx`, `Checkout.tsx`, `Orders.tsx`, `OrderConfirmation.tsx`, `OrderTracking.tsx`
- Tables:
`restaurants`, `restaurant_cuisines`, `menu_categories`, `menu_items`,
`orders`, `order_items`, `order_status_history`,
`payments`, `coupons`, `coupon_redemptions`, `reviews`, `user_addresses`

## Restaurant Side
- `RestaurantDashboard.tsx`, `RestaurantMenu.tsx`, `RestaurantOrders.tsx`
- Tables:
`restaurants`, `restaurant_staff`, `menu_categories`, `menu_items`,
`orders`, `order_items`, `order_status_history`,
`driver_assignments`, `payments`

## Driver Side
- `DriverDashboard.tsx`, `DriverHistory.tsx`
- Tables:
`users`, `driver_profiles`,
`orders`, `order_status_history`,
`driver_assignments`, `payments`

## Admin Side
- `AdminDashboard.tsx`, `AdminRestaurants.tsx`, `AdminDrivers.tsx`, `AdminOrders.tsx`,
  `AdminCoupons.tsx`, `AdminSupport.tsx`, `AdminReports.tsx`, `AdminSettings.tsx`
- Tables:
`users`, `restaurants`, `driver_profiles`,
`orders`, `order_items`, `payments`,
`coupons`, `coupon_redemptions`,
`support_tickets`, `support_ticket_messages`,
`platform_settings`, `audit_logs`

## Notes
- Order statuses from all UIs are unified in enum `order_status`:
  `pending`, `preparing`, `ready_for_delivery`, `waiting_for_driver`, `out_for_delivery`, `delivered`, `cancelled`.
- Coupon statuses/scope and support ticket status/priority/category are normalized as enums.
- `platform_settings` is singleton row (`id = 1`) to match current Admin Settings UI.
