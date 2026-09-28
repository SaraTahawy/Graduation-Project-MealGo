--
-- PostgreSQL database dump
--

\restrict eEVcHb4r5wXFjgK5aJ6GaZum1dwxxvu5bclO2Xk9bX0kIzBdj3FkkyCvXDl5RrA

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: address_label; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.address_label AS ENUM (
    'home',
    'work',
    'other'
);


ALTER TYPE public.address_label OWNER TO postgres;

--
-- Name: availability_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.availability_status AS ENUM (
    'available',
    'busy',
    'offline'
);


ALTER TYPE public.availability_status OWNER TO postgres;

--
-- Name: coupon_discount_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.coupon_discount_type AS ENUM (
    'percentage',
    'fixed',
    'free_delivery'
);


ALTER TYPE public.coupon_discount_type OWNER TO postgres;

--
-- Name: coupon_scope; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.coupon_scope AS ENUM (
    'all',
    'new_users',
    'restaurants',
    'specific'
);


ALTER TYPE public.coupon_scope OWNER TO postgres;

--
-- Name: coupon_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.coupon_status AS ENUM (
    'active',
    'inactive',
    'expired'
);


ALTER TYPE public.coupon_status OWNER TO postgres;

--
-- Name: driver_assignment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.driver_assignment_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'timeout',
    'cancelled'
);


ALTER TYPE public.driver_assignment_status OWNER TO postgres;

--
-- Name: driver_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.driver_status AS ENUM (
    'active',
    'inactive',
    'pending',
    'suspended'
);


ALTER TYPE public.driver_status OWNER TO postgres;

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'preparing',
    'ready_for_delivery',
    'waiting_for_driver',
    'out_for_delivery',
    'delivered',
    'cancelled'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'card',
    'cash',
    'wallet',
    'paypal',
    'apple_pay'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'authorized',
    'paid',
    'failed',
    'refunded',
    'cancelled'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- Name: restaurant_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.restaurant_status AS ENUM (
    'active',
    'inactive',
    'pending',
    'rejected'
);


ALTER TYPE public.restaurant_status OWNER TO postgres;

--
-- Name: ticket_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ticket_category AS ENUM (
    'order_issue',
    'payment',
    'delivery',
    'account',
    'technical',
    'other'
);


ALTER TYPE public.ticket_category OWNER TO postgres;

--
-- Name: ticket_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ticket_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.ticket_priority OWNER TO postgres;

--
-- Name: ticket_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ticket_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'closed'
);


ALTER TYPE public.ticket_status OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'customer',
    'driver',
    'restaurant',
    'admin',
    'support'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending'
);


ALTER TYPE public.user_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_user_id uuid,
    action character varying(120) NOT NULL,
    entity_name character varying(80) NOT NULL,
    entity_id uuid,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: chat_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trigger_text text NOT NULL,
    response_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_responses OWNER TO postgres;

--
-- Name: coupon_redemptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_redemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    coupon_id uuid NOT NULL,
    user_id uuid NOT NULL,
    order_id uuid NOT NULL,
    redeemed_at timestamp with time zone DEFAULT now() NOT NULL,
    discount_amount numeric(12,2) NOT NULL,
    CONSTRAINT coupon_redemptions_discount_amount_check CHECK ((discount_amount >= (0)::numeric))
);


ALTER TABLE public.coupon_redemptions OWNER TO postgres;

--
-- Name: coupon_restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupon_restaurants (
    coupon_id uuid NOT NULL,
    restaurant_id uuid NOT NULL
);


ALTER TABLE public.coupon_restaurants OWNER TO postgres;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(60) NOT NULL,
    description text,
    discount_type public.coupon_discount_type NOT NULL,
    discount_value numeric(12,2) NOT NULL,
    min_order_value numeric(12,2) DEFAULT 0 NOT NULL,
    max_discount numeric(12,2),
    usage_limit integer,
    usage_count integer DEFAULT 0 NOT NULL,
    status public.coupon_status DEFAULT 'active'::public.coupon_status NOT NULL,
    applicable_for public.coupon_scope DEFAULT 'all'::public.coupon_scope NOT NULL,
    valid_from timestamp with time zone NOT NULL,
    valid_until timestamp with time zone NOT NULL,
    created_by_user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    nft_token_id text,
    nft_contract_address text,
    CONSTRAINT chk_coupon_dates CHECK ((valid_until > valid_from)),
    CONSTRAINT coupons_discount_value_check CHECK ((discount_value >= (0)::numeric)),
    CONSTRAINT coupons_max_discount_check CHECK ((max_discount >= (0)::numeric)),
    CONSTRAINT coupons_min_order_value_check CHECK ((min_order_value >= (0)::numeric)),
    CONSTRAINT coupons_usage_count_check CHECK ((usage_count >= 0)),
    CONSTRAINT coupons_usage_limit_check CHECK ((usage_limit >= 0))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: cuisines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuisines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.cuisines OWNER TO postgres;

--
-- Name: driver_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    driver_user_id uuid NOT NULL,
    status public.driver_assignment_status DEFAULT 'pending'::public.driver_assignment_status NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    responded_at timestamp with time zone,
    rejection_reason text
);


ALTER TABLE public.driver_assignments OWNER TO postgres;

--
-- Name: driver_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_profiles (
    user_id uuid NOT NULL,
    vehicle_type character varying(50) NOT NULL,
    vehicle_number character varying(30) NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    status public.driver_status DEFAULT 'pending'::public.driver_status NOT NULL,
    availability public.availability_status DEFAULT 'offline'::public.availability_status NOT NULL,
    current_latitude numeric(10,7),
    current_longitude numeric(10,7),
    current_location_text character varying(255),
    rating_avg numeric(3,2) DEFAULT 0 NOT NULL,
    rating_count integer DEFAULT 0 NOT NULL,
    total_deliveries integer DEFAULT 0 NOT NULL,
    total_earnings numeric(12,2) DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT driver_profiles_rating_avg_check CHECK (((rating_avg >= (0)::numeric) AND (rating_avg <= (5)::numeric))),
    CONSTRAINT driver_profiles_rating_count_check CHECK ((rating_count >= 0)),
    CONSTRAINT driver_profiles_total_deliveries_check CHECK ((total_deliveries >= 0)),
    CONSTRAINT driver_profiles_total_earnings_check CHECK ((total_earnings >= (0)::numeric))
);


ALTER TABLE public.driver_profiles OWNER TO postgres;

--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    name character varying(80) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menu_categories OWNER TO postgres;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    category_id uuid,
    name character varying(160) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    rating_avg numeric(3,2) DEFAULT 0 NOT NULL,
    rating_count integer DEFAULT 0 NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT menu_items_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT menu_items_rating_avg_check CHECK (((rating_avg >= (0)::numeric) AND (rating_avg <= (5)::numeric))),
    CONSTRAINT menu_items_rating_count_check CHECK ((rating_count >= 0))
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(180) NOT NULL,
    body text NOT NULL,
    channel character varying(30) DEFAULT 'in_app'::character varying NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    menu_item_id uuid,
    item_name character varying(160) NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    line_total numeric(12,2) NOT NULL,
    special_instructions text,
    CONSTRAINT order_items_line_total_check CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    status public.order_status NOT NULL,
    changed_by_user_id uuid,
    note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_status_history OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_number character varying(30) NOT NULL,
    customer_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    assigned_driver_id uuid,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    payment_method public.payment_method NOT NULL,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    delivery_fee numeric(12,2) DEFAULT 0 NOT NULL,
    service_fee numeric(12,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(12,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(12,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    item_count integer DEFAULT 0 NOT NULL,
    promo_code character varying(60),
    coupon_id uuid,
    delivery_address_id uuid,
    delivery_line1 character varying(255) NOT NULL,
    delivery_line2 character varying(255),
    delivery_city character varying(100) NOT NULL,
    delivery_state character varying(100),
    delivery_postal_code character varying(30),
    delivery_country_code character(2) DEFAULT 'US'::bpchar NOT NULL,
    delivery_latitude numeric(10,7),
    delivery_longitude numeric(10,7),
    delivery_notes text,
    placed_at timestamp with time zone DEFAULT now() NOT NULL,
    estimated_delivery_at timestamp with time zone,
    accepted_at timestamp with time zone,
    prepared_at timestamp with time zone,
    out_for_delivery_at timestamp with time zone,
    delivered_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    cancel_reason text,
    CONSTRAINT orders_delivery_fee_check CHECK ((delivery_fee >= (0)::numeric)),
    CONSTRAINT orders_discount_amount_check CHECK ((discount_amount >= (0)::numeric)),
    CONSTRAINT orders_item_count_check CHECK ((item_count >= 0)),
    CONSTRAINT orders_service_fee_check CHECK ((service_fee >= (0)::numeric)),
    CONSTRAINT orders_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT orders_tax_amount_check CHECK ((tax_amount >= (0)::numeric)),
    CONSTRAINT orders_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    method public.payment_method NOT NULL,
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    provider character varying(80),
    provider_txn_ref character varying(120),
    amount numeric(12,2) NOT NULL,
    currency character(3) DEFAULT 'USD'::bpchar NOT NULL,
    is_cash_collected boolean DEFAULT false NOT NULL,
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_amount_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_settings (
    id smallint DEFAULT 1 NOT NULL,
    platform_name character varying(120) DEFAULT 'MealGo'::character varying NOT NULL,
    platform_email character varying(255) DEFAULT 'support@mealgo.com'::character varying NOT NULL,
    platform_phone character varying(30),
    currency character(3) DEFAULT 'USD'::bpchar NOT NULL,
    timezone character varying(80) DEFAULT 'America/New_York'::character varying NOT NULL,
    restaurant_commission_pct numeric(5,2) DEFAULT 15 NOT NULL,
    delivery_commission_pct numeric(5,2) DEFAULT 10 NOT NULL,
    base_delivery_fee numeric(12,2) DEFAULT 2.99 NOT NULL,
    delivery_fee_per_km numeric(12,2) DEFAULT 0.50 NOT NULL,
    max_delivery_radius_km numeric(8,2) DEFAULT 10 NOT NULL,
    min_order_amount numeric(12,2) DEFAULT 10 NOT NULL,
    service_fee numeric(12,2) DEFAULT 0.99 NOT NULL,
    tax_rate_pct numeric(5,2) DEFAULT 8 NOT NULL,
    email_notifications boolean DEFAULT true NOT NULL,
    sms_notifications boolean DEFAULT false NOT NULL,
    push_notifications boolean DEFAULT true NOT NULL,
    two_factor_auth boolean DEFAULT false NOT NULL,
    session_timeout_minutes integer DEFAULT 30 NOT NULL,
    updated_by_user_id uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_platform_settings_singleton CHECK ((id = 1)),
    CONSTRAINT platform_settings_base_delivery_fee_check CHECK ((base_delivery_fee >= (0)::numeric)),
    CONSTRAINT platform_settings_delivery_commission_pct_check CHECK ((delivery_commission_pct >= (0)::numeric)),
    CONSTRAINT platform_settings_delivery_fee_per_km_check CHECK ((delivery_fee_per_km >= (0)::numeric)),
    CONSTRAINT platform_settings_max_delivery_radius_km_check CHECK ((max_delivery_radius_km >= (0)::numeric)),
    CONSTRAINT platform_settings_min_order_amount_check CHECK ((min_order_amount >= (0)::numeric)),
    CONSTRAINT platform_settings_restaurant_commission_pct_check CHECK ((restaurant_commission_pct >= (0)::numeric)),
    CONSTRAINT platform_settings_service_fee_check CHECK ((service_fee >= (0)::numeric)),
    CONSTRAINT platform_settings_session_timeout_minutes_check CHECK ((session_timeout_minutes > 0)),
    CONSTRAINT platform_settings_tax_rate_pct_check CHECK ((tax_rate_pct >= (0)::numeric))
);


ALTER TABLE public.platform_settings OWNER TO postgres;

--
-- Name: restaurant_cuisines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_cuisines (
    restaurant_id uuid NOT NULL,
    cuisine_id uuid NOT NULL
);


ALTER TABLE public.restaurant_cuisines OWNER TO postgres;

--
-- Name: restaurant_staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant_staff (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    staff_role character varying(50) DEFAULT 'manager'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.restaurant_staff OWNER TO postgres;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_user_id uuid NOT NULL,
    name character varying(180) NOT NULL,
    email character varying(255),
    phone character varying(30),
    description text,
    address_line1 character varying(255) NOT NULL,
    address_line2 character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100),
    postal_code character varying(30),
    country_code character(2) DEFAULT 'US'::bpchar NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    status public.restaurant_status DEFAULT 'pending'::public.restaurant_status NOT NULL,
    rating_avg numeric(3,2) DEFAULT 0 NOT NULL,
    rating_count integer DEFAULT 0 NOT NULL,
    delivery_fee numeric(10,2) DEFAULT 0 NOT NULL,
    min_order_amount numeric(10,2) DEFAULT 0 NOT NULL,
    eta_min_minutes integer,
    eta_max_minutes integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    image_url text,
    CONSTRAINT restaurants_delivery_fee_check CHECK ((delivery_fee >= (0)::numeric)),
    CONSTRAINT restaurants_eta_max_minutes_check CHECK ((eta_max_minutes >= 0)),
    CONSTRAINT restaurants_eta_min_minutes_check CHECK ((eta_min_minutes >= 0)),
    CONSTRAINT restaurants_min_order_amount_check CHECK ((min_order_amount >= (0)::numeric)),
    CONSTRAINT restaurants_rating_avg_check CHECK (((rating_avg >= (0)::numeric) AND (rating_avg <= (5)::numeric))),
    CONSTRAINT restaurants_rating_count_check CHECK ((rating_count >= 0))
);


ALTER TABLE public.restaurants OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    driver_id uuid,
    food_rating smallint,
    driver_rating smallint,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_driver_rating_check CHECK (((driver_rating >= 1) AND (driver_rating <= 5))),
    CONSTRAINT reviews_food_rating_check CHECK (((food_rating >= 1) AND (food_rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: support_ticket_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_ticket_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_id uuid NOT NULL,
    sender_user_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_ticket_messages OWNER TO postgres;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ticket_number character varying(30) NOT NULL,
    subject character varying(255) NOT NULL,
    customer_id uuid NOT NULL,
    order_id uuid,
    category public.ticket_category NOT NULL,
    priority public.ticket_priority DEFAULT 'medium'::public.ticket_priority NOT NULL,
    status public.ticket_status DEFAULT 'open'::public.ticket_status NOT NULL,
    assigned_to_user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    closed_at timestamp with time zone
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    label public.address_label DEFAULT 'other'::public.address_label NOT NULL,
    line1 character varying(255) NOT NULL,
    line2 character varying(255),
    city character varying(100) NOT NULL,
    state character varying(100),
    postal_code character varying(30),
    country_code character(2) DEFAULT 'US'::bpchar NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(120) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30),
    password_hash text NOT NULL,
    role public.user_role NOT NULL,
    status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
    email_verified_at timestamp with time zone,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vw_admin_coupons_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_coupons_stats AS
 SELECT c.id,
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
    (count(cr.id))::integer AS redemption_rows,
    (COALESCE(sum(cr.discount_amount), (0)::numeric))::numeric(12,2) AS total_discount_given
   FROM (public.coupons c
     LEFT JOIN public.coupon_redemptions cr ON ((cr.coupon_id = c.id)))
  GROUP BY c.id, c.code, c.status, c.discount_type, c.discount_value, c.min_order_value, c.max_discount, c.usage_limit, c.usage_count, c.valid_from, c.valid_until;


ALTER VIEW public.vw_admin_coupons_stats OWNER TO postgres;

--
-- Name: vw_admin_drivers_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_drivers_stats AS
 SELECT u.id AS driver_user_id,
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
   FROM (public.driver_profiles dp
     JOIN public.users u ON ((u.id = dp.user_id)));


ALTER VIEW public.vw_admin_drivers_stats OWNER TO postgres;

--
-- Name: vw_admin_kpi_snapshot; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_kpi_snapshot AS
 SELECT ( SELECT COALESCE(sum(orders.total_amount), (0)::numeric) AS "coalesce"
           FROM public.orders
          WHERE (orders.status = 'delivered'::public.order_status)) AS total_revenue,
    ( SELECT count(*) AS count
           FROM public.orders) AS total_orders,
    ( SELECT count(*) AS count
           FROM public.users
          WHERE ((users.role = 'customer'::public.user_role) AND (users.status = 'active'::public.user_status))) AS active_customers,
    ( SELECT count(*) AS count
           FROM public.users
          WHERE ((users.role = 'driver'::public.user_role) AND (users.status = 'active'::public.user_status))) AS active_drivers,
    ( SELECT avg((EXTRACT(epoch FROM (orders.delivered_at - orders.placed_at)) / 60.0)) AS avg
           FROM public.orders
          WHERE ((orders.status = 'delivered'::public.order_status) AND (orders.delivered_at IS NOT NULL))) AS avg_delivery_minutes;


ALTER VIEW public.vw_admin_kpi_snapshot OWNER TO postgres;

--
-- Name: vw_admin_orders; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_orders AS
 SELECT o.id,
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
   FROM (((public.orders o
     JOIN public.users cu ON ((cu.id = o.customer_id)))
     JOIN public.restaurants r ON ((r.id = o.restaurant_id)))
     LEFT JOIN public.users dr ON ((dr.id = o.assigned_driver_id)));


ALTER VIEW public.vw_admin_orders OWNER TO postgres;

--
-- Name: vw_admin_restaurants_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_restaurants_stats AS
 SELECT r.id,
    r.name,
    r.status,
    r.rating_avg,
    r.rating_count,
    (count(o.id))::integer AS orders_count,
    (COALESCE(sum(
        CASE
            WHEN (o.status = 'delivered'::public.order_status) THEN o.total_amount
            ELSE (0)::numeric
        END), (0)::numeric))::numeric(12,2) AS delivered_revenue
   FROM (public.restaurants r
     LEFT JOIN public.orders o ON ((o.restaurant_id = r.id)))
  GROUP BY r.id, r.name, r.status, r.rating_avg, r.rating_count;


ALTER VIEW public.vw_admin_restaurants_stats OWNER TO postgres;

--
-- Name: vw_admin_support_tickets; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_admin_support_tickets AS
 SELECT t.id,
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
    (COALESCE(msg.msg_count, (0)::bigint))::integer AS messages_count
   FROM (((public.support_tickets t
     JOIN public.users cu ON ((cu.id = t.customer_id)))
     LEFT JOIN public.users ag ON ((ag.id = t.assigned_to_user_id)))
     LEFT JOIN ( SELECT support_ticket_messages.ticket_id,
            count(*) AS msg_count
           FROM public.support_ticket_messages
          GROUP BY support_ticket_messages.ticket_id) msg ON ((msg.ticket_id = t.id)));


ALTER VIEW public.vw_admin_support_tickets OWNER TO postgres;

--
-- Name: vw_customer_order_history; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_customer_order_history AS
 SELECT o.customer_id,
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
   FROM (public.orders o
     JOIN public.restaurants r ON ((r.id = o.restaurant_id)))
  ORDER BY o.placed_at DESC;


ALTER VIEW public.vw_customer_order_history OWNER TO postgres;

--
-- Name: vw_daily_revenue_orders; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_daily_revenue_orders AS
 SELECT (date_trunc('day'::text, placed_at))::date AS day,
    (count(*))::integer AS orders_count,
    (COALESCE(sum(total_amount), (0)::numeric))::numeric(12,2) AS gross_amount,
    (COALESCE(sum(
        CASE
            WHEN (status = 'delivered'::public.order_status) THEN total_amount
            ELSE (0)::numeric
        END), (0)::numeric))::numeric(12,2) AS delivered_amount
   FROM public.orders
  GROUP BY ((date_trunc('day'::text, placed_at))::date)
  ORDER BY ((date_trunc('day'::text, placed_at))::date) DESC;


ALTER VIEW public.vw_daily_revenue_orders OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, actor_user_id, action, entity_name, entity_id, details, created_at) FROM stdin;
\.


--
-- Data for Name: chat_responses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_responses (id, trigger_text, response_text, created_at) FROM stdin;
44f12c3f-8a7e-4630-b3e4-6691166c15f4	hello	Hi! How can I help you today?	2026-03-17 15:55:38.734805+02
d56c571c-3163-41f0-9948-80110353d6e4	what is your name	I am MealGo Assistant. How can I help?	2026-03-17 15:55:38.734805+02
f9663eba-788b-46af-8444-9221d579fef6	help	Sure! You can ask me about orders, coupons, or account status.	2026-03-17 15:55:38.734805+02
3fff6f70-e1fc-4cba-961a-62ad1ad40a7b	coupon	You can view coupons from your profile page or ask the admin for new coupons.	2026-03-17 15:55:38.734805+02
998f543e-6b79-4195-8414-bee0bee1c76d	order status	Check your orders page to see the latest status of your orders.	2026-03-17 15:55:38.734805+02
5eef7d28-f67b-4d94-84e7-78775abc30ca	delivery time	Delivery times depend on the restaurant and your location, but usually take 30-50 minutes.	2026-03-17 15:55:38.734805+02
\.


--
-- Data for Name: coupon_redemptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_redemptions (id, coupon_id, user_id, order_id, redeemed_at, discount_amount) FROM stdin;
13131313-1313-1313-1313-131313131301	bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002	55555555-5555-5555-5555-555555555553	cccccccc-cccc-cccc-cccc-ccccccccc003	2026-02-24 22:14:53.46781+02	5.00
\.


--
-- Data for Name: coupon_restaurants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupon_restaurants (coupon_id, restaurant_id) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, usage_count, status, applicable_for, valid_from, valid_until, created_by_user_id, created_at, updated_at, nft_token_id, nft_contract_address) FROM stdin;
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb001	WELCOME20	20% off for new users	percentage	20.00	10.00	10.00	1000	543	active	new_users	2026-01-25 22:14:53.46781+02	2026-08-23 22:14:53.46781+03	11111111-1111-1111-1111-111111111111	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N	\N
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002	SAVE5	$5 off on orders above $25	fixed	5.00	25.00	\N	500	234	active	all	2026-02-04 22:14:53.46781+02	2026-06-24 22:14:53.46781+03	11111111-1111-1111-1111-111111111111	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N	\N
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb003	FREESHIP	Free delivery	free_delivery	2.99	0.00	\N	5000	3245	active	all	2026-02-14 22:14:53.46781+02	2026-05-25 22:14:53.46781+03	11111111-1111-1111-1111-111111111111	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N	\N
8d7aa4c6-12b2-46a4-8c6a-27c026b37c69	xssxasx		percentage	10.00	0.00	\N	1000	0	inactive	all	2026-02-25 02:00:00+02	2026-03-28 01:59:59+02	\N	2026-02-25 06:02:33.292751+02	2026-02-25 06:02:42.394829+02	\N	\N
6f7891c7-8426-42c2-a9e7-c07be35277c3	lcdnklsdmc		percentage	10.00	0.00	\N	\N	1	active	all	2026-03-17 01:06:05.876+02	2026-03-18 01:06:05.876+02	\N	2026-03-17 01:06:05.876+02	2026-03-17 01:06:05.876+02	0	0x2074a28F34D48dBb77B5e38999D56b1bE80e241F
a05b88a2-453a-4a8e-a263-42822a1bbff0	mcdasmal		percentage	10.00	0.00	\N	\N	0	active	all	2026-03-17 15:59:27.2+02	2026-03-18 15:59:27.2+02	\N	2026-03-17 15:59:27.2+02	2026-03-18 03:20:54.99731+02	unknown	0x4b245cDbFa725d3CEe61f9FF89E12C01AE60fDF1
3386229b-8c9c-477b-a882-12869845fbc1	dscmk		percentage	10.00	0.00	\N	\N	1	active	all	2026-03-18 03:21:36.623+02	2026-03-19 03:21:36.623+02	\N	2026-03-18 03:21:36.623+02	2026-03-18 03:21:36.623+02	1	0x2074a28F34D48dBb77B5e38999D56b1bE80e241F
e6fa33a3-4ab1-41f2-9547-729e0aa1a490	mdkl		percentage	10.00	0.00	\N	\N	2	active	all	2026-03-18 06:01:59.471+02	2026-03-19 06:01:59.471+02	\N	2026-03-18 06:01:59.471+02	2026-03-18 06:01:59.471+02	2	0x2074a28F34D48dBb77B5e38999D56b1bE80e241F
0553b135-f84b-4d08-8b21-663ab6712af2	Off10		percentage	10.00	0.00	\N	\N	3	active	all	2026-03-18 16:14:48.962+02	2026-03-19 16:14:48.962+02	\N	2026-03-18 16:14:48.962+02	2026-03-18 16:14:48.962+02	3	0x2074a28F34D48dBb77B5e38999D56b1bE80e241F
d258f56a-db0f-4152-a31a-7c57ea40db52	dlk		percentage	10.00	0.00	\N	\N	2	active	all	2026-03-18 23:18:21.48+02	2026-03-19 23:18:21.48+02	\N	2026-03-18 23:18:21.48+02	2026-03-18 23:18:21.48+02	0	0xf89130a3479f9c7D2C9bDA7D6Fde167cf345Dcb7
07b5966a-147d-4466-9660-564703d7c1b8	cdsc		percentage	10.00	0.00	\N	\N	0	active	all	2026-04-07 18:40:08.441+02	2026-04-08 18:40:08.441+02	\N	2026-04-07 18:40:08.441+02	2026-04-07 18:40:08.441+02	0	0x6b64687b28F25Ee16c6E0D0Bf9079D4Dbb32b7f7
b5163f30-4996-428e-be5b-385c981a0330	hjkkkkk		percentage	10.00	0.00	\N	\N	0	active	all	2026-04-07 18:43:06.495+02	2026-04-08 18:43:06.495+02	\N	2026-04-07 18:43:06.495+02	2026-04-07 18:43:06.495+02	1	0x6b64687b28F25Ee16c6E0D0Bf9079D4Dbb32b7f7
a37e227e-a5e3-44a0-b745-a968d51b8236	dsmck		percentage	10.00	0.00	\N	\N	0	active	all	2026-04-07 22:28:05.172+02	2026-04-08 22:28:05.172+02	\N	2026-04-07 22:28:05.172+02	2026-04-07 22:28:05.172+02	2	0x6b64687b28F25Ee16c6E0D0Bf9079D4Dbb32b7f7
\.


--
-- Data for Name: cuisines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuisines (id, name) FROM stdin;
88888888-8888-8888-8888-888888888801	Italian
88888888-8888-8888-8888-888888888802	American
88888888-8888-8888-8888-888888888803	Pizza
88888888-8888-8888-8888-888888888804	Coffee
88888888-8888-8888-8888-888888888805	Korean
\.


--
-- Data for Name: driver_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_assignments (id, order_id, driver_user_id, status, requested_at, expires_at, responded_at, rejection_reason) FROM stdin;
ffffffff-ffff-ffff-ffff-fffffffff001	cccccccc-cccc-cccc-cccc-ccccccccc001	44444444-4444-4444-4444-444444444441	accepted	2026-02-24 21:52:53.46781+02	\N	2026-02-24 21:53:53.46781+02	\N
ffffffff-ffff-ffff-ffff-fffffffff002	cccccccc-cccc-cccc-cccc-ccccccccc002	44444444-4444-4444-4444-444444444442	accepted	2026-02-24 21:54:53.46781+02	\N	2026-02-24 21:55:53.46781+02	\N
57feb409-9884-4f95-98c4-3b893cfcd64d	67e986cc-add7-4e1f-83df-a667b5c41b95	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-17 23:57:57.892775+02	2026-03-17 23:58:27.892775+02	2026-03-18 00:08:39.131432+02	\N
2282a074-faa8-4f9e-9088-2a12f15556f3	67e986cc-add7-4e1f-83df-a667b5c41b95	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	pending	2026-03-18 00:08:39.131432+02	2026-03-18 00:09:09.131432+02	\N	\N
f3841272-102a-49e5-9f45-9277ffb8f636	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	pending	2026-03-18 00:13:39.727629+02	2026-03-18 00:14:09.727629+02	\N	\N
a2677b23-34bf-4685-96d3-1b0e45c31f34	1c8958de-cc4f-4f38-936a-700ae2f9ae38	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	pending	2026-03-18 00:18:56.409747+02	2026-03-18 00:19:26.409747+02	\N	\N
b1fe974b-e5c7-4ced-abcf-2f4cbfe55459	1b861d84-69a0-42ca-94fc-ddd91178bcdc	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-18 17:17:47.508993+02	2026-03-18 17:18:17.508993+02	2026-03-18 17:18:25.878305+02	\N
f4f5cebc-474e-4157-9104-cbe36bae7e92	1b861d84-69a0-42ca-94fc-ddd91178bcdc	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 17:18:25.878305+02	2026-03-18 17:18:55.878305+02	2026-03-18 17:18:35.912625+02	\N
81f4f79a-3bf7-4ad5-bdeb-df9220a59336	1b861d84-69a0-42ca-94fc-ddd91178bcdc	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 17:22:39.21236+02	2026-03-18 17:23:09.21236+02	2026-03-18 17:23:00.85865+02	\N
f0dbe4ae-3fdf-42a0-8303-e429842478a4	75e2e505-7d0c-40ac-8512-972d8175ff72	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 17:24:22.67148+02	2026-03-18 17:24:52.67148+02	2026-03-18 17:24:30.150688+02	\N
61ad6c3f-dbee-4901-b0b8-b89af82936e8	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 17:33:43.641445+02	2026-03-18 17:34:13.641445+02	2026-03-18 17:33:53.411124+02	\N
36dbf023-0626-4ec4-a2ff-8490e8be43a7	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-18 17:50:04.488404+02	2026-03-18 17:50:34.488404+02	2026-03-18 17:52:30.01218+02	\N
1a96a00e-5273-4c14-a6f9-dce7b5ddd6cc	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-18 17:52:30.01218+02	2026-03-18 17:53:00.01218+02	2026-03-18 17:53:03.208006+02	\N
59639999-6471-4b12-a0ef-adea4e244974	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	rejected	2026-03-18 17:53:03.208006+02	2026-03-18 17:53:33.208006+02	2026-03-18 17:53:31.918128+02	\N
6a0e7d22-7c5e-4c83-82b6-97180bf0342a	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 17:53:43.24859+02	2026-03-18 17:54:13.24859+02	2026-03-18 17:53:47.716979+02	\N
010aa182-ba26-45e8-8e22-71efbc3f2a3c	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-18 23:33:07.337267+02	2026-03-18 23:33:37.337267+02	2026-03-18 23:34:00.271069+02	\N
e9213b50-cc5e-48c5-9281-062d2bc358a5	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 23:34:00.271069+02	2026-03-18 23:34:30.271069+02	2026-03-18 23:34:07.945242+02	\N
86ff1a29-836e-4ad7-8d22-9dfec47ada23	4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-18 23:44:21.101762+02	2026-03-18 23:44:51.101762+02	2026-03-18 23:44:31.104706+02	\N
ef4f886c-ff8c-4ac7-8001-d8f38c7aac64	f032d0a2-7461-45ba-818a-b8b1e6ea5199	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	cancelled	2026-03-19 00:04:24.221655+02	2026-03-19 00:04:54.221655+02	2026-03-19 00:06:03.634799+02	\N
d34df8b1-5dff-49a3-a008-5876b9c8e320	f032d0a2-7461-45ba-818a-b8b1e6ea5199	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-03-19 00:06:03.634799+02	2026-03-19 00:06:33.634799+02	2026-03-19 00:06:09.891935+02	\N
9623ed37-49aa-4fab-a4d7-75664f398803	674fb0d0-f621-4733-9f68-6f7ee183dacc	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-04-07 20:04:25.565815+02	2026-04-07 20:04:55.565815+02	2026-04-07 20:04:36.211002+02	\N
135ca3eb-abac-457f-a5ed-ce2e6ce50f63	cd209695-2a4b-4bec-81d6-cf37d188ea33	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-04-07 20:27:02.249867+02	2026-04-07 20:27:32.249867+02	2026-04-07 20:27:13.963388+02	\N
6bf06f40-d349-4ba4-9363-8aa29a309185	3e96b760-c3b2-4c92-991c-36d7bca06832	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-04-14 17:46:54.576201+02	2026-04-14 17:47:24.576201+02	2026-04-14 17:47:18.742909+02	\N
b5c797d6-c19c-47f3-9a40-f7176c2f4e1f	4c702736-5a2a-4681-875c-6da304f5e7b1	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	accepted	2026-04-14 20:14:19.910747+02	2026-04-14 20:14:49.910747+02	2026-04-14 20:14:34.410765+02	\N
\.


--
-- Data for Name: driver_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_profiles (user_id, vehicle_type, vehicle_number, joined_at, status, availability, current_latitude, current_longitude, current_location_text, rating_avg, rating_count, total_deliveries, total_earnings, updated_at) FROM stdin;
44444444-4444-4444-4444-444444444442	Motorcycle	B-5678-EF	2026-02-24 22:14:53.46781+02	active	busy	\N	\N	Thamrin, Jakarta	4.90	160	189	1890.00	2026-02-25 06:14:41.018831+02
44444444-4444-4444-4444-444444444443	Car	B-9012-GH	2026-02-24 22:14:53.46781+02	suspended	offline	\N	\N	\N	4.50	70	56	680.00	2026-02-25 16:14:41.830599+02
44444444-4444-4444-4444-444444444441	Motorcycle	B-1234-CD	2026-02-24 22:14:53.46781+02	suspended	available	\N	\N	Sudirman, Jakarta	4.80	200	234	2540.00	2026-02-25 16:14:43.807011+02
bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	Motorcycle	TMP-tu1t7o21	2026-03-17 01:46:53.604849+02	active	busy	\N	\N	\N	0.00	0	0	0.00	2026-03-18 18:05:40.409429+02
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_categories (id, restaurant_id, name, sort_order, is_active, created_at) FROM stdin;
99999999-9999-9999-9999-999999999901	77777777-7777-7777-7777-777777777771	Pizza	1	t	2026-02-24 22:14:53.46781+02
99999999-9999-9999-9999-999999999902	77777777-7777-7777-7777-777777777771	Pasta	2	t	2026-02-24 22:14:53.46781+02
99999999-9999-9999-9999-999999999903	77777777-7777-7777-7777-777777777772	Coffee	1	t	2026-02-24 22:14:53.46781+02
99999999-9999-9999-9999-999999999904	77777777-7777-7777-7777-777777777773	Korean	1	t	2026-02-24 22:14:53.46781+02
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, restaurant_id, category_id, name, description, price, image_url, rating_avg, rating_count, is_available, created_at, updated_at, deleted_at) FROM stdin;
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001	77777777-7777-7777-7777-777777777771	99999999-9999-9999-9999-999999999901	Margherita Pizza	Fresh mozzarella, tomato sauce, basil	12.99	https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400	4.80	120	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002	77777777-7777-7777-7777-777777777771	99999999-9999-9999-9999-999999999901	Pepperoni Pizza	Classic pepperoni with mozzarella cheese	14.99	https://images.unsplash.com/photo-1756361629888-90596c86fd79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400	4.80	90	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
b8668479-44f2-41c7-ba45-21eca76e77ab	77777777-7777-7777-7777-777777777771	\N	mc;sdl	\N	43.00	\N	0.00	0	t	2026-02-24 23:34:54.857852+02	2026-02-24 23:34:54.857852+02	2026-02-24 23:35:02.019039+02
f5506272-cf94-4a7b-ba48-ad2314ac045f	77777777-7777-7777-7777-777777777771	\N	cdm	\N	54.00	\N	0.00	0	t	2026-02-24 23:35:10.913409+02	2026-02-25 15:41:42.692342+02	2026-02-25 15:41:45.258873+02
7d4c8fc8-f10e-4e89-9a73-9d474ac50dd4	77777777-7777-7777-7777-777777777771	\N	lkdsfsd	\N	0.02	\N	0.00	0	f	2026-02-25 16:52:03.550502+02	2026-02-25 16:52:06.196512+02	2026-02-25 16:52:11.013287+02
2343003a-1a53-46b3-b9a6-2725ca934c31	77777777-7777-7777-7777-777777777771	\N	Deluxe Burger	Premium beef with special toppings	16.99	https://example.com/image.jpg	0.00	0	f	2026-02-24 23:34:33.660567+02	2026-03-17 17:37:44.574344+02	2026-03-17 17:37:48.067222+02
c338643d-59d1-46c5-8354-7d6061c553e2	77777777-7777-7777-7777-777777777771	\N	 mklc	\N	43.00	\N	0.00	0	f	2026-02-25 15:41:57.030706+02	2026-02-25 15:42:02.203391+02	2026-03-17 17:37:50.722827+02
a518af96-bdd7-420f-b21b-6b9f0cf0444e	77777777-7777-7777-7777-777777777771	\N	nkfjsl	\N	0.01	\N	0.00	0	t	2026-02-25 16:26:56.976881+02	2026-02-25 16:26:56.976881+02	2026-03-17 17:37:54.370826+02
2529baac-9bd6-440d-876c-1e5e35b79bd3	77777777-7777-7777-7777-777777777771	\N	ckladsmx	\N	122.00	\N	0.00	0	t	2026-03-17 17:17:52.573769+02	2026-03-17 17:17:52.573769+02	2026-03-17 17:38:10.590472+02
b92d7dc7-bbec-425c-960f-c4aac0cb3a7d	77777777-7777-7777-7777-777777777773	\N	California Roll	Crab, avocado, and cucumber wrapped in sushi rice and seaweed, perfect for beginners.	17.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 02:31:30.847246+02	2026-03-18 02:31:30.847246+02	\N
e22da399-b5c8-44b5-8314-bcb6f79a949e	77777777-7777-7777-7777-777777777771	\N	Deluxe Burger	Premium beef with special toppings	16.99	https://images.unsplash.com/photo-1639781436072-897a64a9bc42	0.00	0	t	2026-02-24 23:34:27.45461+02	2026-02-24 23:34:27.45461+02	2026-03-18 01:07:32.227828+02
14ee4707-de6e-4d55-b01f-45f32986eff1	77777777-7777-7777-7777-777777777772	\N	Chocolate Lava Cake	Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream.	20.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 02:33:13.315256+02	2026-03-18 02:33:13.315256+02	\N
b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	77777777-7777-7777-7777-777777777771	\N	vegetables pizza	Fresh peppers, olives, tomato sauce	11.99	https://tse3.mm.bing.net/th/id/OIP.8UeIFPMYwIErE1ShRYB9QAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3	0.00	0	t	2026-03-17 22:44:06.570287+02	2026-03-18 01:10:08.237824+02	\N
387d895f-074b-4863-ab50-746f772a407f	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	Pizza1	\N	11.00	\N	0.00	0	t	2026-03-17 17:39:40.199763+02	2026-03-17 17:39:40.199763+02	2026-03-18 01:51:39.647732+02
22f87891-c912-4940-81cd-55a4181f1ddf	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	Spicy Chicken Burger	Crispy spicy chicken breast with fresh lettuce and creamy spicy mayo in a soft bun.	14.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 01:53:55.90604+02	2026-03-18 01:57:04.619003+02	\N
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004	77777777-7777-7777-7777-777777777772	99999999-9999-9999-9999-999999999903	Cappuccino	Espresso with steamed milk foam	5.50	\N	4.90	200	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	2026-03-18 02:33:17.315711+02
3d2862bf-862b-432c-9ff6-c2d7ff1e7e8b	77777777-7777-7777-7777-777777777772	\N	Strawberry Cheesecake	Creamy cheesecake topped with fresh strawberry sauce on a buttery biscuit base.	22.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 02:34:07.616629+02	2026-03-18 02:34:07.616629+02	\N
4d074bc4-e455-4115-89c4-c8fb3bf4e1cc	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	Classic Smash Burger	Juicy smashed beef patty with melted cheddar cheese, fresh lettuce, tomato, pickles, and special sauce.	12.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 01:53:26.914779+02	2026-03-18 02:00:21.634058+02	\N
0b98206e-670d-4ddb-a70a-90bb5cc46391	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	Truffle Deluxe Burger	Premium beef patty with truffle mayo, Swiss cheese, arugula, and caramelized onions in a brioche bun.	16.99	https://th.bing.com/th/id/OIP.nDE2jWXkB1ZJP5zKP6rAswHaFV?w=236&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3	0.00	0	t	2026-03-18 02:01:54.516802+02	2026-03-18 02:01:54.516802+02	\N
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005	77777777-7777-7777-7777-777777777773	99999999-9999-9999-9999-999999999904	Kimchi Fried Rice	Spicy Korean fried rice with egg	11.50	https://th.bing.com/th/id/OIP.75uDNzvfIbkgFJrRpJBkLgHaLG?w=195&h=293&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3	4.60	60	t	2026-02-24 22:14:53.46781+02	2026-03-18 02:28:21.598795+02	\N
31fcf076-34ed-455b-bb08-0c4c77decf04	77777777-7777-7777-7777-777777777772	\N	Lotus Biscoff Dessert Cup	Layers of creamy Lotus Biscoff mousse, crushed biscuits, and caramel drizzle	25.99	data:image/webp;base64,UklGRoQ6AABXRUJQVlA4IHg6AACwDQGdASokAW4BPp1Em0olo6IrqHWdSXATiU25Bg0dKb9ATb9qsPC5XtPLR5N8D/oUkH0pmr+1ceTcbc6xp7HQxVfJzixodSc6z91zP2q9kfuH4EEENz3n2fR0ur47f4H/kewN/Sf8t6w//F5Lf27/k+wh5bn//90f7o//j3bv3FOoCtD8F5WcL911JziGlDHhuiFZo8pjjyXhtRHacOLAcncbEzYOH5DuwHZ1JtsqpTFJIXFXxNwiWHwkMjTN/r3bShqtG9C/C59FaenGkNoMIKyrqBlgnxnWQMTarbU2yyhTE/Srz/hXnTKMkr6NSVuTFueBDGrdCz7T+F3QLEG5smGCBq9YTTxJX9rBR5VFK1FTeeekcaYB0vve4rW/vCH6I5YRBNGUDdgZgLgC4Z2FIrdKYwYKXJ5U2JMo8v1UnrdFPPYItY+HGXIlpHMtdFhLWF8eAIRQah/pVkJtYJUoV47yyfHbgZw8JawRQxWoAIFPGay6HK8wAl+aHYsbz4BTrKdWTL+AWHK1Tbgvlt9Lm68MPYRiV2jLHAoimP92LFa3qqUvCD0Hwa3QtOXDU9jmX8zvlz9kzQb2N66iGnC526yeIQ2/ukUh8YL1+bXvo3XD3QflWt46P4tLWIzXlvuiS4cXK8jpvqBtv0pm4+e5VRpPBtUqY+CgXXfvYHEDaDV+FxbdQ0/om+TtFQUs+BF2jieZtSxrQjuD4NHlPbOJM8rBg0CoxBx1ZQGLJNbFKkt6od+goMVgAAesAr0zQOROipPcUGMBCF3OclK/VG5ZKGAtO/rZaTri8lTqpI/ykXisvq1QJrHGzPItRfsw5muey62PBVcnKbCQpeTyFs4d/Y8Mt+PSzE2gv8oMG/h9KPTxMr25nUSxMibu7I1yA9XmCFzZPNlSoeZxSoe3DvFPmhSkpGnSA/c9z3sP2u/v2dp0083uvi0WqIrE/wEA68HEd6+ktoDF674mMlyEK+fGdtrt17Hw6sg6o9T2NDor94JiHvEGRg/f04mRYDzK6ambRIjIzwRuSV7O7gNOgBhQC+Ftkga09zawgENlSUtFCdHb+lJx1IDjlIvCO6NyHzyTvnwhaVDkcgeUcDVWNUCuul+OUfbfum7u0BWsFjQZvrKR+3f+KKb4FDe4GnjNpt50BOYcELTWvOkD1ukIoY2nCLE0MNNmrbFjLQG/0QSrVOEs0/qdA9GfwZmW4pAULplZzpAocNsXjSLaW12ESrtVJLucr276/ilbBE/zS8/SZC9t3dJ7ViZlz8tfQYHX3Ejqk5CRk4a5zQj1ODDRj4nfDDDSxbh/M0a9EhmuZKd6lL99Ou+LHIWAk47CnaXeUVE8PzjK/U7UwoNLcYJMWQZDsodmNo013QBPGadLkKjGBScv6/1fnQkT5xfrlsl5PjFf2micdKjAcITyob5CB0Z+rro7WGPoMcPKE5AND+VHqd5iTpzIzrP7HUhI9A9kE7MTKBBq0bdfhwjAMeh0boqx7pfQ2xrSvBu0bYuekXz0AFEF6kb9YO7b9Scx7ddG7mNQUGzSD4hCYQ1O0/BhUEbFYgxq3jWuHXj8lX7gy3mNMVTCan7ZOITG0Plr5fdCPmAk2kemDBVAchZXfuhbhyANcHTvmvVONh8Zd9jiE2M0zVRQrBvLWLjH3N+5Zeq/6FS4PKwwc0Ynk+S9ze6h8spaHKl3sSo/qQX1LT4zEMdY6/qEnLg4jgQSTDg0m90JbpqxvL5R4ptDoy+7qReoVjXoBVqrYWmBM+FRq5+I6IV2KFu94Gw+ekCia/ZlhM071Z0TYOa11CanqzVv4dBaGLbKOfTrjq2k15QlOc+qMgC5QdORLnIH8SW2SK7Fte7yHcPf65+aRZvO4vXUlcz24G0chiXdHZ7sn0R738K9FPoUMe/Osi3z0RCeNjT8WoVLdVf6J0dwM2+8nbr98X8PLL9p/dBEWtITnWIuImwINv+Hf7C2jC2C8CJF2Uyv/WwyyvloPVIOLaWR/FVBZvtLquNwxCnLqVKU4Ugs7y27vT4s02CSFxMDzJC/WDwc6XgUvkB3L2YIgHKGga4qfYl5ZbcO2yDEdatGygTCsPsYVF126r2iffVYwHosni8jCgRND/mpd3OqInP+xLgre3ELBDt5NuzlkIB+OzC4FQfNkJiBzD+k76G/Q8/c5niaAkX85uBHprv/nlgkKot4XfOf5A84QvL9BOx6eFp3kI4CaWyZc7Woa3wgenHkgHtioWbEWkoMpgd/p0E9lUokeh5vQOKAH75std5/SmKgVOwUmvGTT7MELdPDolbhaM9yRyE0w1F3Ddjpl46yF6MGUIdYr4cfRTEPGkwWju2Tg34/rD16xEn42FfMMSOxzk0d0nhk87+cxhjxOFpcVhumHlVcWRwfpFA7EGlwRZ+5cIrj1iSn1tNR3EUhn1uNzLlj+7E0ecEALp2eVMMHUHM7uHRDOL+q9FirLVHK67DLavOvP672ZhnK/FqeV4V5hqsIzqhYQREZkTIbWAo0DcvLX6p7ynd/2KkDDHfXGcP2lOaFNPfU+fq5+b2WLoBi8bdbPdWNv4zf1fYkYCF4S7B8pKGvwGblXKfmFI2wBV9eO0aBpSJ3QHvg8VR0lbE6dL5923sFWMld+GYpLWsLtgPxudVhZ2GCVi/Rxy92/rcKype2l5txaMsG2vehjQQZrWvXThJ2vW3cEJcPtvkqbe+KRxerX3647GBsULriw7+S829c2hETrFCDJbiU6+/D3ngsXhDgynTjID3lnV8c2Lv5UZ3wKoOs/bJX2lDapBmaW7NnQeRDtdA+gX5xIP6G4sO6iG37i3YayCIbrZ79p1bvDImBtIsSRKzBgkvGNzwl3Y5Ffs3IuYKGPyYT0/1W4H1omhkS0pe+Rx8RR6AA+uqvnwSVwsUQag/0Gbp5IRd/IgD9ajs6SS7aPza4uOybx/tj+E+svxK9k8/mIl6SDSgfBVlzhCzep3ZvXDMRmJSFBQMoLVsul1V5Z/bYHanx4aht7NTH61Q9sWTRSEuVDKK0H1von1goFR3WP8nY+NzALc2T6h9+w6X8mXHT9tj3JiFwaRMT30nyBf9tWVoAfTnZxnDfTEuDTzohijXQblgTdjXjgxSaVxt2QDtOnW8IvnzzQTGqLXJeGVqZ6AJ4Zqv3di8ekVIJABcyKe2czz0vbMcCxJ21SB6yTdi+YG6qrAu96m91EhfLHf2DpRNSeu3bHQJS6++InYbsGqEcnOD2CHE+EGcygyqZsAxCm9yZywD/j9McIUCQy5f4AIIvFI4UFrnS7rsVSwpsI9kWzUGe7ZKXAsvEe0DMY+BlWA1vvECa61YS6YN+NvlDljktS8SVmXcWVYjJP6lHLee1MXaKaL+sVmaROg1uAD8OmIROxHCvB8aSQBO7qK5RODUgU+vP905+ebQ1rjKDYtEvnZPAe2psU5vl/Q+oxL3LI8FrrpqK/Daf4hXiRV0ptSFPZfNBJPOR5lBaVLAiJsET6wjKQ8ukMpmwtr5FVP4M4EVOIm+PKr/iX8XAHCm6y/H3RIOyup5I4mzg/CwpFU6/14zi3LlC5+Di8ngo/bw34tjgX/tMXTFpdDfLFLraIOQpIBiR7/QhF/lQxCW7r6+PaZRyLeATYcFb6+X6gFe9wMxsIDhCaZD6djx4D7atZZ+bwPf3TvwM3kYGrh69AnynNLq9ZLEZ0CO1q/kE9czpeBK/MkNu4aS1+ithznjnHsRQ1C80ECP/SaJaC5PdFH+ivJw2aYh80ug7KQH4uUzZy12OrXgYcfQwME33kENO9n1GlNUo0h20xUI7SWB6Btkmh0HZjeeojZwPiQlLiSzvX9Dw38Cuk/VV4DRnWCG3B3naSHyrdpXVCoC/GMBlXdQ5HQckXGGPolBU6OMPqPv3i28y/VcMc0naVCn5wTrHxfR8UN/QnmD3oc/20SiVFgfCk+DhquGJFaHHunHF+hOVASES5U3O1whrXr1lenG1m3qs6fRC+HitjxJxw/hsN+LO9MZb6iXgj0NbhzY5nZLXSYZEc0WyT/+C5AJzDAAbMORP+6f3oR272TqfthhpNDCVztxy0dT+uI4eKz4GUbfDk7bb7XFXLoAOrIljTt2Ilb/80VQKCfL0NOnd7V6SVYZY1nzm0+8RGjsYyq8RI0dsyccXwII2RkXL2h66kOhWQbFNJI88exKZ/W6j1tFJ5h2lyN5QWjBy2PMlSDY48sAncVMenaOXCv0A8rEbCPXXdh3O3+UTdb04U7VoCZGayRNQ4K05SvAAyIDIeWHF57ZVVXRh5YKuH7sbOYiedtAdyL2gWetxr7AnYqtJlEnNpBLQ1Vti+HNFLuHvAzu1ueiyNfIDrZIdO2EQtNz/yOAroFm/6OBV4POzBZhHxAFuZdqq1X4/Qg7HrEYw/au1/bfosy7laWnONjotCijBR4MlzhUC9FlboS4FzKNq7uwGtIdTLTab8phANvdFI3Pi243ODfEI7GemqaNYYiF5+s6DxZL0pNFmp+6KAq4VPd0iKpJSlM1XlaDY2S+SIS4QGEb0IZvbprvzS5t2Rj1iOFUQSH2JHG7XQMVS33X7KTvBc0XsCxvq+NPbFf7j0xjZ4JSUQ4p/FrjjkSX434tKSkjfGkY9Ng91iQmnfbyFag6YSLCWRY7ziosnaAv1WtzNP2li/Zv6C00xsK2fsNC6MSPZ/Hwp+SpFqbZANG6n91wuycuFhY5SZ0anOXBRKE6afSod/lACwSfS+fVBqXvBv1QHDEXn8KLyWSM0Ywwf4oUvh+Wm/ui/AsYxHnRzfayYrbQvzF+ULyux9AfBxGpZhTw4nreM0Od8kB5NSV6Eeca+vdsCw4NCPYFQOlsQX8pHO0M9SaYuaDqL8riDqpfvgLQqKqhkjgTA/32EgabiFEh1RqXry8SiA4HSqLFAu/OcO8oUlBbjijpbUDroBb8IRWqNjI7d6WYMZVlA4BM0kWfrB8edbDWKh60f1xq5SrmpO5scM4nGL0DPwO6VkSf/4mIbeGKhesE5uwcse3tikmEn/0L1dFxMCkRaRukm5qZVl1PRtvf1oMApPXCBGxzwwBnHtPkDnpKxKmmKw8cE5XMRRh4jtl4dGzOPk87fEB4o4FDWcuB+3SmcX/MQydV2ZBrb9HGL8UO9Xj2R+S/pb8QFJEEFBSG9KHeLDJiUnoo1MFFQ4fcW+GlxiYrG95H0dzeyEki0cNbPDLmmGlW/VhTZI9hxKR3cNBkFsLTlpkrVhJpH2nEGoZSlWSPKM9o3dypnhKQ5pLZXzxHwpE2OCiw0U9IBn8tx5HjL1yLKKtH7yrUXYuCj+6coO944FdChVZ+fKUyOa/7Sq4tTXNCR840bmVRVWWw5u3dKVxHwHkM+opjnOk6zMM5JyIf/TiPkGw5rh7F4FxxMHlVZz1WkmLjO3IHcVKDmAx/H3GrlmIGb8mR9GB2Hj+qrl7y0skSf64/qSqIeJsWSnudKFmhVjD7TCUu38Y3nOm06b5tLxrYDixAAyfPVcnIILCuunpdAmOHPf3cYKYSc5OBY4XAueyBoij26XIFYCiU7kbi16v94GFkF+V0OCBpKWMmv1CrFBI8GBRfVy+upBJjRz2tuKdXbHVJZtqmQN66FLYhQA/0P44woSip/+MNgR1jJOdkNvtuF9vp9l4+RcsZFHvvNlWxz3d0Jvyaga4e2ylSPI/ubEmq5l6JksTgN9MLZeO68+Ho7peeImuRKUKLzrV7VaqX4jxaK6KKmm/YB9irjYQlr4ziWrqw/FgGc7cfxzcxKAiWzFQTybor+YLwk4wbB0L+9dG4DycbU7KYQ0sVE4T/DQKKiNz7uyiHCYB7rYYB316LP3g/tGDAM6U2g9BXNnIhgiVjw5/OTxqX2rAmTrcb8yBxSY4CdNk1ZdQqKnefJ1D52viW5Acm2gIuLharMUeQYEkgrfbazelzWjm5ABrnEqkyNLKPog1JnRKAwVCgajvrwDKfO1VkCsfpyWj+c43dxDvRzGK1kgriqlJy4tR9WryUJEtfwoqoX0ZhRZZxx4Lq9HCFbtPhzCDttiU0A8PfWR3ZvodUsVhkaYJFLDeYpT5ixaXk9/eg8Uy8A9VvrH/MfmGs8NPPX+4hzoHLPpdPpdhVYvklDJCxHaCWPWmkjTqb2+hRXMIl0nS/EMdrSJsHc6htg612SXvAbWpkjQPNGWshpP277erIDuyhno9UCyKtO/A0g2NnPGFexmT0C35y1TPZyRYVLflUTYVKgEx+zV6ATNEKH9bqawtdk1Un3VK9raEOCLPuVj1a2Ol0pMHr9whh/PvfSpiZAGYeI8WM1W4K9KwkLx5TU6HqVd4p+/XWk1SsAAxW6ScB5fnkKKohVU4+2gKsxqFSZ1rEuZzZ1MloI58aKchq9wQsO2+7sRRk2mX/XPsydvX6bQo65X+j4WFzJ49eN8mZloeWbCmLcctLRUeMBZ6wyrZnyHCStmrafNayN6NDCLhz9mUsKDD3EOnUWhv924fro3vYsl6HyDTGUQaWlGm79khJ8alXLMHdUPkwWfI/K80ihLecM4wQUiRaTERQjf1NLZnQ2adYNbyqwCwyLyIQAhvuqjrZ2fVhI+5DmIueAJ7hZ05nlH0hPb6eQnCsbejngMDZaIceMPYvrjtCoh8MQqxflzPsiRBfc6kcbJ9gJ4oW5WkksqsT6rUO9K8YFw3u3Kfli8ylIrc/roz37oOa/kVp3pRimvYmf0WDX1gRLGUx+ZjrEt/2KnRMCtUgjqBf1xTbfie5CaaVynfF3wZK5dXsZtEWcAqmLLAy37Aoqf3r8ujJFNh6208buGMS3sm3IrCAU8nsypayKHPMoYnHmbqm1I7ts34uqbTZqejja7KzQuUK9U77HU//y5svgVlN+KpLfbghMYvY7a7x0CcLkN9rJIF62/dHeaZz//joUWyhE4BwImUaXW3uNtq7MUs39Ny16rJJIBwt/f37Gng7+9ZAnbTpsQAe2BcjyyweTGnx02PHaHU/oVd2ogGphdc1qsP+pbkng7ZYSAI686JACkivf/Czzumf3Ru1XxaX9nyGyL5ZFINX4CL5mz7navJkb5HHp5w/lVam2hfDiA1QbkgmnqlkH8vYcZa0AkwrtBFT8oZhlpzAICK/MHTfp5oi5N6YrqX5nzPVVIpYF/VfZSVFxnljt07AQSrpcpOfl5BTHN/EJZBPA/70IuBwlEG7j20JXTpaHwGbjsu8906tVPooqYgVQsnBiqBdpOsuTVg2Xk6LWuE5xniSvua0MUyq0nBT2pgIK0woJ1gvHS87QNWl/KRffzdgtI90lQgHa4PbIxNbse7PJI9y/gftLjoZtmMSi0c2qm/nCwjlUlaN+K98quy0m+kgh9NxXcfewbU/oLhauRhQSIKIZCgws2K3pBaox5yVZgNlw32XGUeo3Ub4U2BUoeJO+ardNg0owCFqHfDhhAxIWdBAg6rXJTWpFMYpvwEpAP3FaNwzi19xozAMp0SZktsABp74aULHluYiMEm5d37DTD5BY5T9I2rzlwqP/pIsJOQYXOYbKGOPB+gq+8/q07XpGbK3Oo31y511+4xhwtAxAxTs2gpJwgHsZXl9AaC9407Qf0snl5zKhcn8PDC4yV8o7PIr0rsf/BvzIQ/1sSKP0L5rsuv8HeVf1VBMB+IdwGD48J8/saGyb4aqP7OaX0fv1tNNJqFnza/1Al/PtE8hELOx5BS+wIwm5fyikxXMCyOwkCAq9xepMi6hcAVqeHaIc7okdZaFk1GRlrVPZz3yJDRbktkJARqlvxTa+yoWK8XW5fSvtTisZYZzB36GNwEK2AAU9woR7DphAwCxEqWt8rIYyrof/cKScHflL31z7BstS6QH1l9Gw6nr3CvStxYN9qrG8f/qznb7NX7YdmQO0izx14Q2xEekM9/uaZqs2yfth57n3KJX4UtWiDbSCZ21+dG9wSPGnImYHNRb5po0+PcdkQi+HpugNDqQ8/tG/WlGucnTAtiN8FoQWDUmCwMEIK+35UlIUWPTKTZ/A7hMkMee8YD6iW3xMeElAIAdrOCfxHTWVMTFfi0kX8PdUORSSmdwVcsIF0V9mIUtY8J1IaSySQQOzqquMpR3vRoeWDoiqpA7sAAwynnH5Lreb4lOQ3pGilF36gd+7yDDiPpFtKJxRm4Fy3D5HkTB/JG7rRoW0yoxqECeBZ97UaxsmWlHK1LUUwSZlZHdXu17KjloX7hpEZCd0fiT9VUgzeNLK+7YBawrC5Qa5uWW2+S5ZCLjmCXO9XFEeteA8C7U+R2+di4GOPrD5Bj/K/P0G5NSKop73I6X06enQG9MQnMSktg1ao9xdhb5nLJVr3HvVwnnEIdjVx++QEbDotKmhKh81qZzz31vZ7Otz9uhXNyU7C0cmtnCfq2/xDAJ7GptwkxgAiduNm25iS7X51yx3QULFVnq7q5r7+HgURD+NnwkX3Q0Tr3N6OvNAMm35ijh8/vJjfdn95mMlrz4EFHKNoQeUinNcBvGkIvCwhWhSmm+60sDV+99YN3eOQsUG5UWhNFGbS/3aV2h6LaNyFKMwqCY9xWZN09mRg31n8DbxnkeOlbHrA7TWj1yj+5bkWuNWxXUrUzpRNkhy9yUChA0gw9Yh0I2gaowiffhZldw8Os7/ddrwx0ySc1qlEdjD8epF5xnfB3k+uxkmKFDI8aGBsgxrXzA8+YGQ1yM940SZu6AmfS5Dxywg3dZNt/jrqPrb5FPsw03VWxTDmaQ/TW/RE7tITNMktLDzK5CgxHsmnvDXbDeyfMCwQI29lk37Xx4M8GW88OsRsCGF5N5c8eyTIK/PEnBqfpOUFtFciqwjRZi0//GxGHbXnoLc0byNTl/LRggpRttLvVQNPRTdLxjmfILUOlPSuz4Eam0A9OYJ4R3SUyNW7Glk6ylP5WxlaTDzpHARDXevSWC1gqZpiwq3h2KxPDJX7+Sd6StYYKPy3gPOWm9mYp8cR72bAobeEd52/A47KWtI9+C7JXTdF2Xq6I7TQF0VRghqtvUaYhUW6Hx27jEyQinL1GIaUBeJ6brbc+w/udPZLKIlQEF+iHwsF7owfZh2H+rAZtul8ZiWc5cYqBd7IDIPMjHA5O0xWOZlbiHXo2xDB7ApZ1HVr0/O/+4d+N90r1Q3wiULaTGxNH2vIPajglefP1YfAk0+ZvTBOtylhdgnl3Q8fSNyuLDNn0ghVALObuMU+/mjDGZec4KiL6fgMyOVYD1599S0mJGgKM0ajeCwixlcdJp7pnjpGtNcP+fGZUohLgkG5D+exWoMMeCIbaFqaRphloB3t9Pp8YmlMRUjNE6juzqpN6LNkY2o6+uoScpSwe9cyy0vh33jsPGLUgp4qAvxSh1DUSlUtpwT1mnkfA2xv2zGVVuOk9YcpSokT6L4VNmV5z+sfe05ok9RbgAvQwLfZLqI3jTtwOxg7mdI3uIdEDC4MxLpfH47LCLsDk03t92mVg5eoXzu+1JGo/m/EC8tBT6YXwbZ7Z2PbxngIEFIeFbGbZkndW7C589Xo2J4gh7JzaRTK/7OeMfFKu8to4MciASYiyLpFBp/UDEl5EtC6mAJSJsVRaSOPZBe3axWf0+ClezlbzJfVVNIE27wc2fRuGPuLW8KnGuiJj8Z3kc+tqIlh9uFTYEGsLEbC3xSMNk7tQs6keq8/iZAmHmqZa8QluGcnC7V3GrBiTTdc3XsdjXLPL/wyG5tLP9RKcs23+4JEIIoBemglkSnzXR6VMN9MPvBqtBCIGmhSPs50DyN4g85S9eo9fukVsibKCfvTPBTrrkMrr3nvV9GWocxB3EvoyvLTc/V/zndU5E3HapZN8FEtLuHolOcazn/KD8KQVGKwVCt2LclWBVV2kmTvx7nEA3fNiOw2rsSv9H/IcY7mV2AwaUvlq+5+YypRKFkFVjPuKCtj/H9U2DCzIdIlUt8C0Q15dlug1PiUIGt/ujW6PhlA6oK65pzvHJbYz2S7WzPSPma4Yn/UNeBiKwfGwlkrTO/JM0A9f0SusAFebVnonlXei43GsptK4AQqGbIyP6G9gvAfge/x1xVgoI5XAyT4anWIA7Vj6YV0uPvwu2gDenhvViLlzMlz6OIQ9t29lnWc6uGCjLTSCxHpHKO2XpnOEhS+/MZZqGrWAMWNSsk9l5Me/hlMZEfYLKsVmqbl9rWLouOkG5DsW9brsUeEvz1ULl0+h1o9ZYnU8+Nc8PvlgkwKLlUK1uiyJgQxuauluwPXHA4Pmp4Yhm9/QVjmaMFs/cSgeT5QSx6FXwLh2SbxOLVtUX1hvfkHQoCYTrZ0NyBhcCDwWqfRs+lr7VpJRUet/DR8Ku5FwtelUJUYjzZxiB5k/nqePqS5HE1bH7F7HrMRj1XvSxveAYrkw6dlTqrTGlr4oz58IrhfJ72yLSqh23zjeMMxAo2rJWyc827panXMMUPbJjVZrhXqw3PLcawACXrp9LL5+o47r37VRTypANltI08HLP5VZKB9WhIF94WFqLQNoiG6T/pb2EhTUZcY/JazyRmlMKvxHPHij1U8706ObHog17fnrOpXgGtSqUsEulAQ+66yb3bKZ/NBRxE9KkZFzWAtuN1fFzo/FjF6WiJk8SzjWBIRuFvTC+nyuQduToYRZW19W5l4p2xS2kxumQyJH3qdMV/8SoeB+JH3AWo5QWJ1cAN2TPrOyBOWARSkPXhq9e9Da3KsJFtN9xEDIwkTvafU2kEKNCLcf6i9mfGq+pKpVOKv5tRVd1ljbFJ2Y/2k4i/dqnCcZJxN9DsVNxEs7LvFw5+D2B9LQat0e5BaqHEAPfXPtqmQj/KEe4l5d/LFuAXBcQmErs2BGB/Ef9iRm7c8Liql1/E2tARWewHPutVJu65sg7nSrQ1Dw3KrJPFAHTd8d3JnNBXTg8ObPJwWMnTXMRjPjkh00xlXNltMu+rSWoqTD3WDSUIaMZqH5P/yzfgPbNJWCH64W2Q6YZReurQWeBmD34WjRJSSrX5dQRKrKj7EWuWj4PXGODVZbtgV85VgUZvPPHpj5CrJZGZFLJiLcqqrypnXPnTSn0gB1vQNR/9AE3NKjrXEvVBXzB0AYXbUYWX3oH2G3rOMbsSIMr4nlCdlbIRBaqGBLTMmPpRUWOA8IiZd6AtluHuJFsyHKFHJsDoUEXjrOxBLaiZbVl7cbbp0k0drnpdiPVUSw6kwIlrMY48bH6sF49govOxAVq3Vffa57OdbCJROAm9edd3C3et0kdbakbwlbzlLRRbT800pwQxhdTDxS6qPVzNnQrT+mzrmsT/mCtukJX6EC+El8gstJhlscriCCdDybHR+UchNqppYbu7BZhGEIFPwyKBH5SJf1E09a3YK2ac2xbw6R+K7xfovXkJkINsEpKr4hxhN9NDJ9ntOVDajorg7/3HSLBR8TxvtEj+KxD2SFReBSjurhddK5ucw/CCml5dGcaR686t3FWhETxS3+NeE5pYIA3lixmA08sNxLc+3EdUAv6hl8TUgDoHkMwlqBVwkiBAWP8jDLPvPiQ9TZ4onsJT2neuDBJY1MV/6obWz0jKDXFrnhZ41f3upBnoyCX5BqK6MCqKp1vbjCJHx7k2mBfdrKVor3K9pm41IxfZp2TvgrF73wpwSqi+FVCpznF68evgL9DmkbEmcZnxyAoPevBzUj3gAYg/Fls7algj8z+7PG3ou9U9eiYDNBuwA1myrGryx3QzHlj81U7nB4lHP8lR21JPMzsYr3gNKj3KuZ2rGjqbfCAFOZXGA0QH0/Go+2cqecFom3wQGS/+EQ8aq4hzcEAQthdbmUidAPXuDKaE6UchX6nWwE7X+FTeh7+06Jmk44JkHya479fPwgV43Jkwm4ej8A5YrfxQKVh88hAYroANAQVRYauxMczG7sdeliN0MqTytmqMIVFaH8HxQDu4TsuZzsyAx+lPbDrnAveCSmp2IQlXXMtuCuZcBilcwINIFTWkieYdwNJ6qzGPg5Kp4NFeT2YCRNq48unua3/724pcbRhbBZlTEn+qjC4I/DTAphsGqsLwUMKWFJhmceyr0/oVbxjiq4Th8pfcQgpi7UaQYMycRjBaySDScOhTvkIobNBybFwn17TdqL9rZJ641y1E5WTWeymk7MhKWRs3rsDpbZVbYpp/9qH1boPg2pDCsGrrauvutCJ5tsLvVo89OclMB7TDl7yan/kFzCaKWH2c2EGD7GhN2szmQIkrdA98bZU6QdifME94/2XEAsMa4vCoR0T8TMA9k/njq6eWtNMB+PDACM/tcd1F2ViozlJU1d+Yuj6f8rJ/HSLigpWtS8P4zCPnf5SvNKmIOlMuBcE7hyZfCtSgl6dx6Z4RgU24u4yDmJt/AipUaccGslE08td80EgBTqufLQiWcYi/JLV6jO+B7x4hhhR3AioL007tQq86hkFxt5opJnCsaz84HySBs0h5yCHQeit5y2keOV4vqgOmJFnijn55d4yj9TftNRb2QlYRYazr0HoSTZHwzsTThASfjOhJsNmkpv7o2ATefoVGT2Tkd+KN+S9y7RQv/qtC8emv8s2qSxzN9+5YSdwZ7ptLDndblGpcCXaj0W8YMfuj9/lvOKZVUFDs5bMuGZKPo640XAJai1enjqMbwMSd5HDztJCmUkzLoSY1ueqmXkE6t+z3Y70pi9bzuqznF+457rRFEU7IdVIcvONscbpqs8PV/lr0h8g5fiJ0Os9z3k4CB6UFuAHXiGZzR28jqy397Gyy1pxyn5gmeaADf0sNXqwmBCyPFxJn6MOfgXAtXHzfm7MIYNULunLMqF02v655YvEaQNmmOR1XflB+e9SdI0vZjS2q4qmKEl6phXbJbHpr5Go0h++Xu3GF6XR8AGRNSzrbK2uInPD8ik3n3KU7gKdadZetStn0SAisZnaKCUNetYSg1coORvI74QdSQma47Yfnj2j7e50rmHkrMWI/YG3/6Lf5DmC9CIB9stI2mkQlHz2xWRqqgxKcNojwYYVUy7gR4vdwjSyHxUNHE/balvRio3vZJxKBYHft0xwTLmD7ztDdNPziTfWeu8Bwowx+g3iwaNjKCcN09qEaVzjMXNfIlXrfsqlvEzvolH3hKyAEYy5M1uoSMOT4/zEuZr0deUPLABrQFs4GgZ5lXB4oqoBWOCZwX2YeH7wBSwZ0Mw6Oz8ZTtd2aDgscruQuhGIbj+3JbZ5zAGKR8CwwxeIBl6IUvv8bErg6EK5RRyEieZvLKj5TVN5uuSTtSel9B6Xp4GZXbkGZFBe23bebztdEI80AI4b5fBFAhlVBHuRnAw6YW10KnXKOdr7xMyD3wM+Dvct1NpuLKBuT8Icwwy4j4dIp/RPJl46IoaOvmQ4B+2FpojaEiT2NBJvIbb2FQTaAPOcQXl5n8nwzorH1oysPVLAWZgZl+XmUzRF7g6p0vO7djbw9C9qv3ycFHJc7apqLi0eouVBOsgIvVNYVKPmj9EXxAzLS7YlrLSLsU4iVgecPn+mZoKOXfoOXR5EvsPUHf9TBmZYDV9DRu28LboQW2sd0uvj7R85juMOfbvEpIz3Wh08kZ042JpqISmIPp3b2ddQR2v4L5Xd07N6XPCkIltjuphtxOamZ3UYuvAxJ7LDXN427XVbD/YoMrhqc/hk+uG0GF7E/tKSPse09Hlah6fEqkn0t4AALy+YDuYB2+2gyGqNu60k1XB6r4qvqGwTta0Bwtigr9lKy2VSEateUo9D6ieau43pXUkrtk5aZ3y4WecG9J0AzjF80JknYcmJhts1Y5SoGLIPdxNkwyJdBvFlgFNPVicjTYYnxdv6GOvaOEC/Dbnbr8pflTlhRhW9yWaeYkt4aJR92/NqZHPE3zcZ6iKFoGJgBmF13Gk8omYILJPxCen3cWLBnH3hCq6SHfePgXanqaaj7LDon688OjnuLkpHsVicSM4hNjmSfVr6tF6hFPHJlzwtg923xxF6a4pkgjdgh+YwGDVCfB1wK5pSySsxS40uRPdKLlFM2t0ngFBVtTSzgLv2tT7a1xhFaYY+4cmm2R9q+ax8bM4xRnLCWIQcy4fiffwio0es41NZT9cjGwAaCuz7L52DN3TVRjRhf1DmbfLcamjE+88xmBBZtqZC176Z4PgSfnyelfVng66d+N56/MXCiflEVccp7oEQJW1OiOKDg64xOE2POIw8/pXvfffJaSijHZeTeZjQWvV65BSZKGDFgKNCcf6hEJqfh5GwPdrAtUFPc9PQMAdl1CCD2l3+YwAHqYjyLVDG9d37nVqjoArZEsVjZF4miX+yIgzbcfUcKdvKXpRrOXCEr9F9hRtWU6RcUtaXobVWBmIqUPxwEgR1t6ZQtFpPlyC9LA2ylHb2GWtcmLQfVqBdBZ7bQggHNAABzIErVYGT2nGCVIqeFyRpEfPNb5lQyeICZtgO6CF+Z0wsA4F9BPHvQTde8w0zWUNi38P33pcEUuJkX/IMKfnBA2C2KN15ID/0eqGFJDRQVCPeBtzJRXmRIxDhIBPT377jOIt9lpsyWasggxJHnwgBTUDwtkz1eXi6ql3RlGiwYXKGQxF4B9Wl2rqNk5LzMwJ1xhXgRJnguPSkEUSWtfU/YJ3coUCFzlpxVTN49FjIHTTxCrpQizlqNyKATTrq1yZPuUJDtegUxRA1XUo7MfX73ZTGvQ3QhutoeGMlUs45TMobM4aibIdLVMkWZT3zbt1eGqh/jAqK/H2DdjGid+ZESR8XMM1QRLBD70sWHXClp07DD9dIwJeIxfufqwwDyP5jnK3jjE5Rx0CDU5OOfy9hBth7+YW0uJ95+tAv3xRy0/EbFfusjmNJ2faz5/E6MynRe3LKkCPxvve3//8yWf2ocx75hF5XWv/1IOxl9xqLQqGQzuVFhu+7HHfYCSEVGLEQrGfJZYVqsTM04YmK/2HS9ySi1d7YMH+1SyfuJx/Ax6vNRcJlfmadEN4kXrwXFBfj0IqZ2M74hjdJuRCgdnC7ZSE587Y4hZMWm4nN+MbDv26p+bQuSVvTiFCuhQ4mPH5qR0G8DAF6CQFglRWx0DSfCclIXy2fOkBaJB4TTU8nhh5MxlNuU2W0raP5u0licn1gJsZl3Z+ik5sKBP+Sey5+5slSgD+8/+X0c+ebne/fC5WLCpxkL1JQWcAs+IJ7EquCpkx3s+a9lITxU7IzQKr99gIDNDNBoTgm1wdzHY/NNckVmDIfGnNXHs/XQ60IhF6KxVAu1jc5D7BaoZCpTVb+weMz6/HbFHJtrdt9Kklhrd3vhfc2xklA4kqSeFHap3STA26D2M+IaGz5jZ8/GKpn+JhDz1opvaMqHZ0xJx6NDjS3qUzvaWTjKl/7kmUzdRPoAWiY21mWCeOGUCua6o0JaydEBo2VLyLpMUCO8OeR46ZsAh9ywb2Q/tx7O4709RDunu0pX8tgLED4x+LkNtZg2h2UbqUuu1sWRNjofhsx9wT0M+Mj6zHjcLC89nC3CSnQR+XBpvpq+GGbmF7rcjGQTZU9WdYqW3FqMtfT3VFb4bRdbRnTdl7qyaSrylWJRiWQwVd2g6jPdsT06M/D5drhWKeHisxsiZIKZTr8T8GqdJeR5sAboHZiimnkDrb5roChIrIs70NZr1sq4jOJw5LRk2tsJWZNvIkK9g1xEzhIW0Oa3WXfs3HCyBz65t4Dy01asVc43MAubGU4cqGNZH6PX6CTS52KYKqIDYLJeGTwIYf3FVtOdroDMQX8TI6r8FaHnLB4658pWmj/HP3yI7gp16b61WOo5heduZF8l/pYjIihZDmzAZeYRfLHO0AUSkAIhLTjpUITHuybBfcegSbGJksCihcnAlcOJYTd1tAtGTJJ1a7wQn5GLvCe1q0shES9RaAiYXZR2MWyWu0dNTIpbDYPyPsp0qgd6LhpTd8Uom3+7RU58WvK/99ZrxC/QGbLEvMI/Bwnf1YP+gD3xliawTG/0JJby9J557d4iUWmdgtjJvskLhIBqf0alHlc9xDwQjJzCWYuJbz0jfEyg+V7gC4BYDjpuZGtSAuCJ4AmTZxRt0x9A5FPysYrXQDL8G/AjNYfrsNOevcGv20ip8xW5XDIY/l/IXgr6UBcOAuskNazAmlxA5m8xcubQK5bdtQRfrBf+3KU2CQsXjpozQ6bVq5xtTNNYZLgQ0ThYF/LFBGW7n2EK5anrnJLRI5pZTpYOIvfBns5yUSLEBsOdShLTpRpyrh0WlsWHvVoVLHOB9V3CO7305pfaG71i5nyyEp5Ec7KJmVtzq+T3S14aU2TjeJV2KdCOnvFX2IvXlUcytCq8GLBqwCxbogLToecwPqMDWZKA/Sow2VYl94MblDG5X693HUgEeJtj/XRUQKyEweWOatzl4qq+dvw19wXyPyNuJXPa71alOQZ9Uu59+0hdHlQna1F15lavQUqwq64jdHosaFwfJkPKfFfeUcjpQttcN0CRwdr/zhsO/WbG2e8vfpGa9SzAxZTJ/7VE5T7CLU3thF2H6tj2DecMQqktU3q2T4zCaNZtZ98yxyGApxb0p8ANjzkNBBdHAnubjbnQU7H1zk4ZaXI5SC8zlr6vH1zhCJ8ICGUjXCxr5Tg45RBAHeGaxKNSDApGlf76AQ++Efr9YhmUGSxmDLsPxfLZjhnoUNkLJYI6pqcDFve/ambuDQ6l4QJnPQ2x1SMiYObhs1FEFLGn8t0X38fX0nUpGV8XdUIX0wXHkwksidf9I8SfVhtMrNhARszKlyBs74CgGiIJMIoi8iqoDDHCkUyb/DECMfiEAos8RLZ1pM1YPitQC5HisdEVllPFwBAbI0416zgCG5HkMZ7dl1Q1VrdHtzZeyvt7b+BSOzK+ROMA5ScELY0iw6rDDtOUPbdS3tEnlfIu0BelUEzCrYIdurLhp/Pun6WhXzxuwVR2tFacT+axki4q8j3oaXF1cF8B/wUKdUG90XyYTOAF6FJcEbJ3L9/klkAx1EMyNON5aMU+Fa1lEds95N33s2Rfv8d8g99E+Xic4YeMD6bQqdf6C1LQAmOzgPMmrT+Gh/4gAX+tLwZrQ0EZaBW+JBYfraWR6eVHlyJJJ38Ibc2voLcZQDGBhFO/hL7dJBOhpLuG519ai5DKFiBz0sfrTGr+78uOWx3Gk1VbWbe6DTpSWXSYbYvvUiOmmn8H2NuOxS8vNRIdBHLv2a/hwcV0gBljcf+GtMasSmQBPEHza50WNDnx8apUwGcES05djLUW2F1Z8ZXb5elpavgT3azWm/7z5FL6KL7iqU+Khbnzp0bajn2ni0sxwg6oKhMdoAXthLYN2nqI4aYNpN+kR6Ar6AwKPCDhCA+u42ZeMeY2MqyTbxXkzEqxvJUbVJ1SOPQfK6g/9NPtGOP/5Cr3E3Y7YeLrAEdk/ctMhNElQ0fytkxS8NtTokCAS3FtUYrDNmDZ16k3vb52MPfnST3XU03zu4wpK7i/b47SFtQaaAyjKjS3Y1FuaQaD9VwmJAsj1kBxinHm7SUQc4AeCwD8XYbO8CmQfshQn9keRIvqqvtSi74A+o1BLu1U339vx8sHC2C0JPdSwbVkk5wR/Y3LCX05Ist8c4oOxhUPDH1Qq/BPse0T7QHzaU1OvmEOtSe5JXCDju7elqByC/k7FGi+HvjXa2KJWeHORMEI+Aq4+rlAc03tDOG4Z/kb2/kTaF7RfMpJjzaBw4eBVtk+Y4zpPmgABTird5fv3tx4UhZnjuxr1aCQ4yDMsS0vAW4KRkXYkC5VuTBySIHCZbZXp6tKnwOaAXOLU7RF2AB3eMFlMxaoQboVpXIyMEwDUYDc6+lIH76b9f/5FUl+s48sgMYDEOdREI9oWQh8ssEBE61yZrvRQqJeGvQX9UTLQj3K44WHX2yvGKYZqG7PsMSZ4NYyudrKL5FMcyWYKrigDE39vRJD1NWUpAaUu3c8XFjcyOLiHCGjVVLjYI1KCyMlIwSbtvEkZ4YkRRdrKVASXkVHMrESw31TTk7G+IrfHtFOlVOuHY7HXGDyD7ueoCOFEDoHuA1QPm6fQgJ1rjYRRLV5Y4rwOPUDZSiRrTUUlGQPXfbcZxkR6RYSNvEh7MmJAvVN2qQX4B2R2VpN9Q7AUjiy6pVYnqZJLjmMhHN+Y7sQwZCGnC8Lemuz4cvaWBnqZByd6lL515yvirYQ7CvX8B5LZsuBapw8s/inHtlAy1fvgZPrNYSWND1LeNQyAXxdSXoUmcrOJQQdzmdWCcQIOuSa3UgNfLQ0y3XLgfsW9LaYduODt3Xj6ACZ7Yu8V32qTpop1qVgduyM2GnJA0mmjfpeEAEBOyvEny5NlCgph3s2segheghLGmoKe60WnXVYi3SZJnCmgoOVDW9F+WUuo5K0FNFGZCoa24LBPE0wk8cs7JAz1Uf+mWCICybPlby4aGHFDTaYkkJaYQbrjyx6ROOwCzdPzyuWXECeKWIldVggugN48dY6twipnNT/ExFHTNHah2wRBnctBRTknQ7UHVcJjDitr3kdbubAcJt03tdiim5XooJA/BqJvHZ0pgh/26W3tsJZjJRnaBX5S3oVmds511qu39YyEvmFrJPU9JBV+QkrUcLuvBz0J6YGfmAaV3klyM/SVlYbW5o+Lv0SxjcPH4TCmgwSqf3Lw6OurdZsPSwUBMQr6W1Vmjo7KWt/KVeqouhktZIFpdh8iGr2dzoq2ZHV9BiXhb9wgt2Ygph2FbFQgOoT4QfPuy1X7scoT0jdh9PTzz5a2w4PViT0WSZhfD9IpZpiHhnPEJjrCxBd2V+pl5ichvqoay6Y5Ql4NBByQVenN1M99lcm7UGZtkK8K9CW9k+ZrwKkj+uokJsAod7/qDp/qQVSqXMroJI2Fz1ReG/7AdFwAmC905uCBKKfh94yxQ6f05HzsDRFIfOaw+9TT3k839snyEh5ccJ+0uv4Oe0pqf4wKCS/M0hDbIjlJpfgaS3wsK30RD2VG5fb2GTTpyy74tkafXqXyEMGw/hjpUlrFLayJTDa2ljBo1I+qZbaQP5uxifW8MSE/cKNlIU0uyiYsAmStFp84sdsGnsgDl4X4GzX+hbmlynzRAlO4X1i3P4U2Nz2Dhf6BCehtv0Vio0IRrCu1hR0uu4JCOrSkZ/ZDV8Rx84sDvcKmNt1q5zEfA7gVxFb4zg9ze62vIbCkJR1ZI4z5reKmPxEuquJI/Wev+e5mVpqLCEfvVJuD7iVmcUtBHS3XG9JsfhviIqvdAEVAQfJCyxE4JGusNRtsOSSbbmEqQ1yyQhxXyXL7JUf+LPNuxVUnhsj5v4zlMqetJsXDeEcWR/zn3gjCyer6RMxX1RHsfx4dW8uUPUO/0XTYmUeumSHKBDAYkLsxP13fU3ouwsMIrNrxONfNZ6SSZvCeweSNJQBDcw9dd+m/kXK4Fix0OlCUr5Wm7OC+sDIv8mae8edSyuCg9Fb2bUQ/qWbXsmU/H83aX9PQkhRqoroHGMjquof8wpMn89CWS8JMkLDIjl1v+TjxC/2PNoA1zQ/Tw47i4Rt1ILrSLxZZJwSbTwUfQOefdZo3Tj8BcQNqUjvGzZXKA3RKoowyfg0p833k/dwmss67NUbqp1MkpI7ITzwF1TaipVfhZ9Rk+3sqar04r4w+QR9HYezr4+T6xcliaZxYuppdlscUlfiKnBjuiaPkzeiUKfVZm9GPEKvAhSRqbf1zxoUhaULs3X2y+IbKkBoCKXBQm4HBYC2olwpv2JdnE6wBUFO2OzG9z5kEybHwGKanGGsG70ibUbIRVUX3g6Ds3qBtF7Nc8nCkZ+jQBvOV8WX/JsjVEujNn0QpqD3kNxr+yyDFrOq4+0RWtZmwMuAm61Nlz4kbf59VUZ96vzVi6cazva2I4PcOdKaFzFW8fozwNYJFWg2eowfOtVY4YGHJG5KsEW1FY62YRMmG34PDS505VJSio519W377TDVTZpfwJu0hjvWzzBXFt7dljFMxHdpyBH+AKocnclGzi6A9KaBN4jd7fmsex4cQADNLphEB+qrCi4mVRIxYEIiVjXuQBpbdZ/oMXxBrtqQwAAA	0.00	0	t	2026-03-18 02:34:54.430769+02	2026-03-18 02:34:54.430769+02	\N
b3013483-2a7c-4615-b295-2dcbe7312f85	77777777-7777-7777-7777-777777777773	\N	Spicy Tuna Roll	Fresh tuna mixed with spicy mayo, wrapped with sushi rice and seaweed, slightly topped with chili flakes.	15.99	https://th.bing.com/th/id/OIP.jj8rpy5KYhgMgQlM_CrOhgHaHa?w=172&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3	0.00	0	t	2026-03-18 02:30:32.812054+02	2026-03-18 02:38:28.96949+02	\N
379a7e1c-e629-4417-8b00-3e806611e83f	77777777-7777-7777-7777-777777777773	\N	Dragon Roll	Shrimp tempura roll wrapped in sushi rice and topped with avocado slices, eel sauce, and sesame seeds 	12.99	data:image/webp;base64,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	0.00	0	t	2026-03-18 02:29:27.784959+02	2026-03-18 02:39:32.556101+02	\N
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003	77777777-7777-7777-7777-777777777771	99999999-9999-9999-9999-999999999902	Pasta Carbonara	Creamy pasta with bacon and parmesan	13.99	data:image/webp;base64,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	4.70	80	t	2026-02-24 22:14:53.46781+02	2026-03-18 02:45:55.082427+02	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, body, channel, is_read, created_at, read_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, menu_item_id, item_name, unit_price, quantity, line_total, special_instructions) FROM stdin;
dddddddd-dddd-dddd-dddd-ddddddddd001	cccccccc-cccc-cccc-cccc-ccccccccc001	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa001	Margherita Pizza	12.99	1	12.99	\N
dddddddd-dddd-dddd-dddd-ddddddddd002	cccccccc-cccc-cccc-cccc-ccccccccc001	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa002	Pepperoni Pizza	14.99	1	14.99	\N
dddddddd-dddd-dddd-dddd-ddddddddd003	cccccccc-cccc-cccc-cccc-ccccccccc002	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa004	Cappuccino	5.50	2	11.00	\N
dddddddd-dddd-dddd-dddd-ddddddddd004	cccccccc-cccc-cccc-cccc-ccccccccc002	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003	Pasta Carbonara	13.99	1	13.99	\N
dddddddd-dddd-dddd-dddd-ddddddddd005	cccccccc-cccc-cccc-cccc-ccccccccc003	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa005	Kimchi Fried Rice	11.50	2	23.00	\N
12a13cc4-4f7d-45bf-9bf3-3b78c5463786	21029cd1-eb88-4520-9178-8bb78d3c30c7	e22da399-b5c8-44b5-8314-bcb6f79a949e	Deluxe Burger	16.99	1	16.99	\N
bc9d5f7e-eb45-46af-9111-c7f78ecc5d5e	3b5aecfe-fb0d-440b-bd6f-a6596b6b64cc	e22da399-b5c8-44b5-8314-bcb6f79a949e	Deluxe Burger	16.99	1	16.99	\N
1d20e74f-ce6d-4866-aa11-56652bbdbbc5	4e68536f-777c-43cf-acc1-47d473df3977	e22da399-b5c8-44b5-8314-bcb6f79a949e	Deluxe Burger	16.99	1	16.99	\N
3d4357af-9749-4e03-8865-ca9814d639af	19e6c5a2-3375-48de-8448-6319b6a7fda2	a518af96-bdd7-420f-b21b-6b9f0cf0444e	nkfjsl	0.01	1	0.01	\N
35fb5d11-6c2b-4581-a715-6deb3f49dd63	18ca9e90-9d65-47c8-bab5-1258e8c76eb3	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
3eaf07e7-991d-41b8-a8b9-288bbe3cad52	ed22d00c-5b85-463f-82af-5a4ac3ab810e	387d895f-074b-4863-ab50-746f772a407f	Pizza1	11.00	1	11.00	\N
6371082c-e94b-4b51-b9b3-240d6c04bad3	e00bc2db-1f0a-493c-bff8-3e36dba76e70	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
ba820fbb-4c5f-4d01-b3cf-4745efdf1753	b6bf7787-766e-42a9-8115-5d10f9020d2a	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	2	222.00	\N
d443fe96-7360-4ae6-a671-b809c4b825a2	881eed9a-b05f-4619-bdbf-96157f0b0dd6	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	2	222.00	\N
c9e9548b-151c-41cf-993b-c86d729bd167	d635f29a-661f-4365-8125-41fb128a7554	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
85fb0edd-66b4-4989-9977-68f103a0647d	67e986cc-add7-4e1f-83df-a667b5c41b95	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	4	444.00	\N
1ecae7ab-9ed8-4b2e-ba32-55c449f79be7	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	2	222.00	\N
b1869fa8-3198-474d-8e42-b6efb96a27ea	1c8958de-cc4f-4f38-936a-700ae2f9ae38	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	3	333.00	\N
d33c3f11-adfa-4bbf-be80-4bf070a99c08	43a405f1-c08b-4d23-9173-2baab0b4ef07	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
f2e9d8d1-81df-45a3-b9de-dfc414bdc6dd	337379e7-8896-46eb-a1c0-a542fc2c64e3	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
bcd1d780-590d-4508-9dc4-5a8bcfb2da4a	91bffd30-78d1-433c-b776-06fbc068c885	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
1316442b-2d52-4188-9ee5-a4a18ac4eeb9	bde2c155-2079-421c-bd0a-0cf01d0cd2e4	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
d2a1be49-7df9-4b2e-ba35-fdbb12148283	60e94698-b2c0-467e-a641-0d21a21ca821	b0f8f1f7-dee0-44dd-87b2-21660c6ccdb7	pizza2	111.00	1	111.00	\N
5c80db22-3603-4b81-a785-a5194429ddd2	371e6e66-c566-4daa-968e-f422bd8defa7	aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaa003	Pasta Carbonara	13.99	1	13.99	\N
8205878a-0a96-4324-b098-8d08d1cf5f00	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
0da60fb8-ffec-44e4-a67d-0d91458a8684	b1f0eed2-7802-4124-a142-318f00e52406	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
f8f13a46-e51e-48d1-8ce2-c3ede12ab100	1b8caa60-cf6e-468d-beb9-2fc06b37c412	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
b40776fd-ecfd-471f-81e7-caca7017209e	16a694af-b921-413e-a69c-12f2af3ed552	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
5105cb7e-3abd-4a4c-a27c-d4d56b5f4637	b3b58535-a283-4db7-9afc-193afd2fe896	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
64be5c8b-44f8-4c80-ab35-b8954fe8a081	4e53674a-1863-4335-a275-079f6c0a7b90	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
78b8dc8d-a109-4737-be79-478b31cc6876	8cae2968-6b44-4e50-a5b7-b9751b882f11	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
eefd1c73-8d98-4a26-bcfb-ee2e63746a55	884e49ca-a80a-4398-9e8e-1491bc123ef4	14ee4707-de6e-4d55-b01f-45f32986eff1	Chocolate Lava Cake	20.99	1	20.99	\N
faca5cbf-c453-4323-ab3f-7c35e66fee63	884e49ca-a80a-4398-9e8e-1491bc123ef4	31fcf076-34ed-455b-bb08-0c4c77decf04	Lotus Biscoff Dessert Cup	25.99	1	25.99	\N
06570c21-cdc8-4843-b939-1e976982d136	56e4c7ed-37a0-4903-b60e-5a200db697ce	31fcf076-34ed-455b-bb08-0c4c77decf04	Lotus Biscoff Dessert Cup	25.99	1	25.99	\N
719ac935-2338-4a2d-9178-9953cddf2bae	958c84c6-62ea-4a98-a7b8-8036f009315b	3d2862bf-862b-432c-9ff6-c2d7ff1e7e8b	Strawberry Cheesecake	22.99	1	22.99	\N
a9dd8fcd-96bc-48cf-a4e3-81652c3544eb	1b861d84-69a0-42ca-94fc-ddd91178bcdc	22f87891-c912-4940-81cd-55a4181f1ddf	Spicy Chicken Burger	14.99	1	14.99	\N
363bbaef-2701-409e-999e-a8bc8d507edd	75e2e505-7d0c-40ac-8512-972d8175ff72	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
0194a6ec-6f74-4ab6-a2b5-f08bb25051a2	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	4d074bc4-e455-4115-89c4-c8fb3bf4e1cc	Classic Smash Burger	12.99	1	12.99	\N
c6143332-a3e8-477b-a708-9b1adc633975	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
046be9dd-a82a-41a6-b4d6-ecad85055c8a	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
4758ec2e-a184-4232-9201-414369ce1bf4	de2a2338-aafc-46e5-b8a3-fd25a1d2d567	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
44c0349a-c5b4-4be1-80c4-6d7e4278c44b	4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
99cfbf92-58f9-4293-a1be-018747721fc0	f032d0a2-7461-45ba-818a-b8b1e6ea5199	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
3f16ffd1-10a7-40d7-b075-500a9359acba	674fb0d0-f621-4733-9f68-6f7ee183dacc	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
44143b1f-72f7-49c8-abfd-07aa9d5382be	cd209695-2a4b-4bec-81d6-cf37d188ea33	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
e2de26c8-fb56-4f54-9b0a-35697f8e65eb	3e96b760-c3b2-4c92-991c-36d7bca06832	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
55a94014-233a-487f-a5d7-89e874634277	4c702736-5a2a-4681-875c-6da304f5e7b1	0b98206e-670d-4ddb-a70a-90bb5cc46391	Truffle Deluxe Burger	16.99	1	16.99	\N
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status_history (id, order_id, status, changed_by_user_id, note, created_at) FROM stdin;
eeeeeeee-eeee-eeee-eeee-eeeeeeeee001	cccccccc-cccc-cccc-cccc-ccccccccc001	pending	33333333-3333-3333-3333-333333333331	Order created	2026-02-24 21:49:53.46781+02
eeeeeeee-eeee-eeee-eeee-eeeeeeeee002	cccccccc-cccc-cccc-cccc-ccccccccc001	preparing	33333333-3333-3333-3333-333333333331	Kitchen started	2026-02-24 21:54:53.46781+02
eeeeeeee-eeee-eeee-eeee-eeeeeeeee003	cccccccc-cccc-cccc-cccc-ccccccccc002	pending	33333333-3333-3333-3333-333333333332	Order created	2026-02-24 21:34:53.46781+02
eeeeeeee-eeee-eeee-eeee-eeeeeeeee004	cccccccc-cccc-cccc-cccc-ccccccccc002	out_for_delivery	44444444-4444-4444-4444-444444444442	Driver picked up	2026-02-24 22:06:53.46781+02
e2a0bb84-86e4-4a39-9410-5159e8fa57ec	18ca9e90-9d65-47c8-bab5-1258e8c76eb3	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 22:44:22.422646+02
f57bc5de-a87d-44c1-9338-7d9a907689d9	ed22d00c-5b85-463f-82af-5a4ac3ab810e	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 22:51:53.800248+02
0639fdcd-197b-4c88-bb8d-a19e574253e0	e00bc2db-1f0a-493c-bff8-3e36dba76e70	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 22:52:38.047276+02
779abc3b-3ffe-4240-bd77-25a057d3bd84	b6bf7787-766e-42a9-8115-5d10f9020d2a	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 23:23:41.524911+02
ea9edc06-04cd-488d-8229-748b7b47b243	881eed9a-b05f-4619-bdbf-96157f0b0dd6	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 23:25:34.465609+02
2e7f0d12-55db-4bb8-9772-a828f6d24606	ed22d00c-5b85-463f-82af-5a4ac3ab810e	preparing	\N	Status updated by restaurant to preparing	2026-03-17 23:26:07.214308+02
1cdfb8d7-720a-4a7e-86f4-f0cc6ccf3aca	ed22d00c-5b85-463f-82af-5a4ac3ab810e	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-17 23:26:09.510738+02
eed2cfcd-d676-42b0-ae69-9948ced66cf8	ed22d00c-5b85-463f-82af-5a4ac3ab810e	delivered	\N	Status updated by restaurant to delivered	2026-03-17 23:26:12.661073+02
ee720ea0-475e-4cb8-8266-26d2ac577c8e	881eed9a-b05f-4619-bdbf-96157f0b0dd6	preparing	\N	Status updated by restaurant to preparing	2026-03-17 23:27:21.077716+02
aea578c0-d021-4bf4-af80-42f32b2c8131	881eed9a-b05f-4619-bdbf-96157f0b0dd6	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-17 23:27:37.185329+02
9eb5f05c-d01d-4bdb-a8bb-bc269fc736a1	881eed9a-b05f-4619-bdbf-96157f0b0dd6	delivered	\N	Status updated by restaurant to delivered	2026-03-17 23:27:47.571631+02
6191f2fd-1630-4d38-adea-b676750c25fe	d635f29a-661f-4365-8125-41fb128a7554	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 23:42:53.848383+02
c0e39023-b614-4eef-b7db-7f7d55ea428c	d635f29a-661f-4365-8125-41fb128a7554	preparing	\N	Status updated by restaurant to preparing	2026-03-17 23:44:08.960275+02
0ac66310-1a9b-4110-be97-43737eebd24f	d635f29a-661f-4365-8125-41fb128a7554	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-17 23:44:21.566394+02
5cdeaf57-6e94-4e53-bbd4-7d9de99097be	67e986cc-add7-4e1f-83df-a667b5c41b95	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-17 23:56:57.572924+02
7e6b9dab-ef1c-4cdc-8bdc-7a5611000220	67e986cc-add7-4e1f-83df-a667b5c41b95	preparing	\N	Status updated by restaurant to preparing	2026-03-18 00:05:05.148036+02
6d15f405-b52c-4869-8bea-5a5d158f6eb6	67e986cc-add7-4e1f-83df-a667b5c41b95	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 00:08:16.466444+02
364e971a-b83a-4188-8d9a-975c01baa756	67e986cc-add7-4e1f-83df-a667b5c41b95	delivered	\N	Status updated by restaurant to delivered	2026-03-18 00:08:44.682371+02
3bb86859-fce9-4fbe-8eb2-8fe1dc349cf0	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:13:00.005326+02
5d4c084a-71f2-4842-bdac-d923e0a54978	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	preparing	\N	Status updated by restaurant to preparing	2026-03-18 00:13:30.370539+02
2135ec63-2004-497a-8bcb-c6639836465b	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 00:13:32.685773+02
c02d744e-261b-4f08-a80e-60f787775d00	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	cancelled	\N	Status updated by restaurant to cancelled	2026-03-18 00:13:56.73764+02
03a967dd-fcd3-4f80-8802-bf0f20cbe09b	1c8958de-cc4f-4f38-936a-700ae2f9ae38	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:18:27.660982+02
bad90dfe-be0c-4850-9f1c-a46f087fc9a9	1c8958de-cc4f-4f38-936a-700ae2f9ae38	preparing	\N	Status updated by restaurant to preparing	2026-03-18 00:18:49.621936+02
f44b3df9-198a-4fc2-b407-ea94f56e3b34	1c8958de-cc4f-4f38-936a-700ae2f9ae38	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 00:20:15.641295+02
02047d64-8bad-4145-9304-560b9fd7e72f	1c8958de-cc4f-4f38-936a-700ae2f9ae38	delivered	\N	Status updated by restaurant to delivered	2026-03-18 00:20:57.54286+02
4b439c05-ead7-40d9-bf72-832962067d20	43a405f1-c08b-4d23-9173-2baab0b4ef07	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:24:07.919531+02
a98c9375-f64a-40c4-9a3e-0a7286dfe509	43a405f1-c08b-4d23-9173-2baab0b4ef07	preparing	\N	Status updated by restaurant to preparing	2026-03-18 00:25:05.679759+02
a0515030-facf-47ae-996d-0a97cffb8e1b	43a405f1-c08b-4d23-9173-2baab0b4ef07	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 00:25:11.397782+02
bf9904df-03a3-4e58-b8f5-35ab35121767	43a405f1-c08b-4d23-9173-2baab0b4ef07	delivered	\N	Status updated by restaurant to delivered	2026-03-18 00:28:18.039414+02
019e1758-5e85-4ef7-9bec-69582f781669	337379e7-8896-46eb-a1c0-a542fc2c64e3	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:31:34.022625+02
25030d6d-e929-455f-bacf-0d5bbc3e69e8	91bffd30-78d1-433c-b776-06fbc068c885	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:32:56.250527+02
49500404-54f6-4ffd-a962-77da1f5b9418	bde2c155-2079-421c-bd0a-0cf01d0cd2e4	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:36:03.869702+02
14d17826-a29d-4dec-b006-1af6feeaf0f4	60e94698-b2c0-467e-a641-0d21a21ca821	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 00:36:31.687457+02
e4e46ec2-6d18-4b19-977a-f45cc45ec5f0	371e6e66-c566-4daa-968e-f422bd8defa7	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 01:20:17.889493+02
44a76bcb-2554-4ad8-b1c5-582610978f2b	371e6e66-c566-4daa-968e-f422bd8defa7	preparing	\N	Status updated by restaurant to preparing	2026-03-18 01:20:38.922624+02
0da3b4db-72ee-4053-8f20-0d5895f2151f	371e6e66-c566-4daa-968e-f422bd8defa7	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 01:20:48.978565+02
27332d1d-63c7-49ea-9adc-f2380c30b71d	371e6e66-c566-4daa-968e-f422bd8defa7	delivered	\N	Status updated by restaurant to delivered	2026-03-18 01:20:55.055402+02
9750ee80-efba-4d5c-be69-2cef7bdbf57e	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 02:47:50.651469+02
4853f9b7-2529-40f6-9de7-e4e513999abd	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	preparing	\N	Status updated by restaurant to preparing	2026-03-18 02:50:23.949632+02
90008be7-c05f-4cb5-8fd0-e36ccc15a143	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 02:50:30.185209+02
08d574c0-3aad-4558-af9c-75421a6a23b8	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	delivered	\N	Status updated by restaurant to delivered	2026-03-18 02:50:35.602132+02
4c99ba64-40a0-4ca2-877b-686a3e12ecca	b1f0eed2-7802-4124-a142-318f00e52406	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 03:01:15.288649+02
c6537437-a098-454b-b1e4-9ba33ad3b7bb	b1f0eed2-7802-4124-a142-318f00e52406	preparing	\N	Status updated by restaurant to preparing	2026-03-18 03:02:00.62477+02
81fb5d0f-028e-451d-9040-d42750761418	b1f0eed2-7802-4124-a142-318f00e52406	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 03:02:01.496939+02
f4c706bb-21da-4855-9a6e-7d0fa90bb599	b1f0eed2-7802-4124-a142-318f00e52406	delivered	\N	Status updated by restaurant to delivered	2026-03-18 03:02:02.116155+02
6ce02319-8f93-4b81-8b29-98815de4f81d	1b8caa60-cf6e-468d-beb9-2fc06b37c412	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 03:08:54.097637+02
2ed3ffe2-a86e-42ff-b228-a02c88499d94	1b8caa60-cf6e-468d-beb9-2fc06b37c412	preparing	\N	Status updated by restaurant to preparing	2026-03-18 03:12:59.629222+02
6395976d-a213-4752-a949-9a1d0cae1ccd	1b8caa60-cf6e-468d-beb9-2fc06b37c412	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 03:13:00.382228+02
761ff0e0-4d49-4b58-9b8b-8a4c96d80b28	1b8caa60-cf6e-468d-beb9-2fc06b37c412	delivered	\N	Status updated by restaurant to delivered	2026-03-18 03:13:01.119833+02
319c7845-8709-44d5-aad9-2a47e0abbd4a	16a694af-b921-413e-a69c-12f2af3ed552	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 03:16:02.833506+02
455240e4-cb0d-4c9a-8891-6026524a69f9	16a694af-b921-413e-a69c-12f2af3ed552	preparing	\N	Status updated by restaurant to preparing	2026-03-18 03:16:16.016717+02
cdeea8d2-cff6-4cd1-bd16-7f7c28871d41	16a694af-b921-413e-a69c-12f2af3ed552	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 03:16:17.155223+02
bc745f57-3e73-4c0d-8b2d-ccace03d5882	16a694af-b921-413e-a69c-12f2af3ed552	delivered	\N	Status updated by restaurant to delivered	2026-03-18 03:16:18.026137+02
55ac3075-94ed-4942-9a6a-a10b97b02aa4	b3b58535-a283-4db7-9afc-193afd2fe896	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 03:22:00.575416+02
0ba6739e-76e0-4c5d-bef3-54652329aa43	b3b58535-a283-4db7-9afc-193afd2fe896	preparing	\N	Status updated by restaurant to preparing	2026-03-18 03:22:15.596163+02
a75c7a01-08a1-4d6c-a3c6-d5a05d4a349c	b3b58535-a283-4db7-9afc-193afd2fe896	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 03:22:16.306308+02
eda1607b-0ec0-440d-8db4-3217eafa6488	b3b58535-a283-4db7-9afc-193afd2fe896	delivered	\N	Status updated by restaurant to delivered	2026-03-18 03:22:16.926066+02
1746e2e8-a0ec-46c1-ad1b-c265d577276f	4e53674a-1863-4335-a275-079f6c0a7b90	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 05:27:57.38322+02
e1081629-d244-432a-8b6b-56d3c0e760ab	4e53674a-1863-4335-a275-079f6c0a7b90	preparing	\N	Status updated by restaurant to preparing	2026-03-18 05:29:34.633804+02
dc1d2b97-e59b-4656-9ac0-eb92c7508fa1	4e53674a-1863-4335-a275-079f6c0a7b90	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 05:29:35.500337+02
074e95f3-114b-4bbd-abe6-7ec31832561a	4e53674a-1863-4335-a275-079f6c0a7b90	delivered	\N	Status updated by restaurant to delivered	2026-03-18 05:30:15.467209+02
837a223d-ffd0-4f8f-812c-12d62b297388	8cae2968-6b44-4e50-a5b7-b9751b882f11	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 05:41:25.420729+02
f0138ce5-15b0-449c-8714-8136ae743a94	8cae2968-6b44-4e50-a5b7-b9751b882f11	preparing	\N	Status updated by restaurant to preparing	2026-03-18 05:42:06.711384+02
5101feb6-59f0-45f9-b1d2-a1ab6614e48e	8cae2968-6b44-4e50-a5b7-b9751b882f11	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 05:42:12.883946+02
dce81822-6a68-4e0a-8572-ddd858e52502	8cae2968-6b44-4e50-a5b7-b9751b882f11	delivered	\N	Status updated by restaurant to delivered	2026-03-18 05:42:18.431076+02
5f31479f-2f29-4b9d-9240-af0e8b2f4c99	884e49ca-a80a-4398-9e8e-1491bc123ef4	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 16:11:15.817944+02
582437b5-e7d2-445b-bc83-37b4436c676b	884e49ca-a80a-4398-9e8e-1491bc123ef4	preparing	\N	Status updated by restaurant to preparing	2026-03-18 16:12:23.842456+02
fbf1e11e-7ecd-4edd-8370-fc8d2ca84628	884e49ca-a80a-4398-9e8e-1491bc123ef4	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 16:12:37.510625+02
b62f0b1b-8ade-4fe0-b6e2-1185d16bed31	884e49ca-a80a-4398-9e8e-1491bc123ef4	delivered	\N	Status updated by restaurant to delivered	2026-03-18 16:12:44.450288+02
ba3e2c24-eeaf-473a-b17d-3aa629fad149	56e4c7ed-37a0-4903-b60e-5a200db697ce	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 16:17:47.225739+02
721e258c-d5a7-47e3-b901-4c635bf35d81	56e4c7ed-37a0-4903-b60e-5a200db697ce	preparing	\N	Status updated by restaurant to preparing	2026-03-18 16:25:52.291631+02
5d9bbefc-55cf-491b-aaab-83b99c4920d2	56e4c7ed-37a0-4903-b60e-5a200db697ce	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 16:25:53.098945+02
293ebc99-8a6f-42f5-b2f7-68fb56544961	56e4c7ed-37a0-4903-b60e-5a200db697ce	delivered	\N	Status updated by restaurant to delivered	2026-03-18 16:25:59.213312+02
ebf12662-7a68-454a-a32d-6ab8c5765d23	958c84c6-62ea-4a98-a7b8-8036f009315b	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 16:39:30.684431+02
ce3a0776-8100-4310-9b73-c498cf87afb7	958c84c6-62ea-4a98-a7b8-8036f009315b	preparing	\N	Status updated by restaurant to preparing	2026-03-18 16:39:46.385009+02
21f1e536-5f7c-4c09-80e2-560990289eec	958c84c6-62ea-4a98-a7b8-8036f009315b	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 16:39:53.059061+02
e25ec1f1-50da-4b68-aed3-82f9df86cb6d	958c84c6-62ea-4a98-a7b8-8036f009315b	delivered	\N	Status updated by restaurant to delivered	2026-03-18 16:40:09.167585+02
c2d99a9f-3054-4a6c-b4c6-ae09dc318b87	1b861d84-69a0-42ca-94fc-ddd91178bcdc	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 17:13:00.264218+02
0560f574-e719-46af-becc-63732d590f94	1b861d84-69a0-42ca-94fc-ddd91178bcdc	preparing	\N	Status updated by restaurant to preparing	2026-03-18 17:19:21.360237+02
1d746c54-559f-4ff1-b38c-9da16059a9cc	1b861d84-69a0-42ca-94fc-ddd91178bcdc	out_for_delivery	\N	Status updated by restaurant to delivering	2026-03-18 17:19:32.108643+02
98cf2fc6-2622-42dc-a9b5-95aba0406a6e	1b861d84-69a0-42ca-94fc-ddd91178bcdc	delivered	\N	Status updated by restaurant to delivered	2026-03-18 17:21:55.355567+02
a2eb58b0-495c-4b47-a4ad-ba67606ab77e	75e2e505-7d0c-40ac-8512-972d8175ff72	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 17:23:59.365183+02
e4b9d856-8669-40ec-8f45-834e8592fb21	75e2e505-7d0c-40ac-8512-972d8175ff72	delivered	\N	Status updated by restaurant to delivered	2026-03-18 17:24:46.5126+02
4bd4fe5a-44f7-471a-adcc-5525712c377e	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 17:31:31.514844+02
0c66bf8d-94bd-4290-a643-53ae31f16d79	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	preparing	\N	Status updated by restaurant to preparing	2026-03-18 17:31:51.565952+02
1aa8a715-c656-4b80-b2ec-06f63db94d66	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	ready_for_delivery	\N	Status updated by restaurant to ready	2026-03-18 17:31:58.167216+02
f71fef55-8baa-4a40-8cc1-8e8171e71159	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	out_for_delivery	\N	Driver accepted the delivery request	2026-03-18 17:33:53.411124+02
f9025934-8b22-4f9e-a02c-4fe0440006e4	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	delivered	\N	Order marked as delivered by driver	2026-03-18 17:34:05.111314+02
a7309706-46a6-4856-88cb-8b5cfd5aa7ad	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 17:38:12.716611+02
773520c4-e193-448b-b611-edd054d07892	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	preparing	\N	Status updated by restaurant to preparing	2026-03-18 17:38:28.26356+02
c73967b4-07ea-4ced-92ad-cedc4cd18c46	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	ready_for_delivery	\N	Status updated by restaurant to ready	2026-03-18 17:40:35.221768+02
b763407e-a93c-4c69-820a-ed8dd8155548	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	out_for_delivery	\N	Driver accepted the delivery request	2026-03-18 17:53:47.716979+02
3fb2d065-395e-49e6-86bb-01c776a1a4ac	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 23:30:57.689543+02
778f9067-31bb-4d93-b642-03bb958dcf32	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	delivered	\N	Order marked as delivered by driver	2026-03-18 23:33:17.43731+02
c1d95124-719f-458c-bbca-e8c84a87d48c	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	out_for_delivery	\N	Driver accepted the delivery request	2026-03-18 23:34:07.945242+02
c8cf6db8-86a4-4045-828d-71fd3d5dcca3	de2a2338-aafc-46e5-b8a3-fd25a1d2d567	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 23:41:50.709304+02
a6a11412-ad5f-4fe6-b3b3-a74895730dbf	4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-18 23:43:35.094987+02
411b7426-1491-4e25-bf9f-683135f692ce	4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	out_for_delivery	\N	Driver accepted the delivery request	2026-03-18 23:44:31.104706+02
ed768067-1db9-43eb-bfd9-b3ce4bd97ca3	f032d0a2-7461-45ba-818a-b8b1e6ea5199	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-03-19 00:03:29.247698+02
7ff0cde4-2817-4315-8ef8-30726e0377c8	f032d0a2-7461-45ba-818a-b8b1e6ea5199	out_for_delivery	\N	Driver accepted the delivery request	2026-03-19 00:06:09.891935+02
3bd1d1a3-5462-4b1e-8bbb-27eb1dd3633a	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	delivered	\N	Order marked as delivered by driver	2026-04-07 18:23:58.748305+02
92cc5ea8-ba8c-433c-a0b0-0d73fe2b3b2a	674fb0d0-f621-4733-9f68-6f7ee183dacc	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-04-07 20:04:02.730803+02
09705173-57e4-4b6e-9087-a9683c84e25c	674fb0d0-f621-4733-9f68-6f7ee183dacc	out_for_delivery	\N	Driver accepted the delivery request	2026-04-07 20:04:36.211002+02
98b6e1ff-87d1-42ec-ba2f-92ef151d2f0d	cd209695-2a4b-4bec-81d6-cf37d188ea33	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-04-07 20:08:37.326928+02
24f9bab4-41f6-44c8-9d41-2127637fbd96	cd209695-2a4b-4bec-81d6-cf37d188ea33	out_for_delivery	\N	Driver accepted the delivery request	2026-04-07 20:27:13.963388+02
aead8fe9-8e0a-4a05-adb8-80928371a390	cd209695-2a4b-4bec-81d6-cf37d188ea33	delivered	\N	Order marked as delivered by driver	2026-04-07 20:27:53.100829+02
f2b634b4-c9ae-4386-9ee2-7de8884a70f0	3e96b760-c3b2-4c92-991c-36d7bca06832	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-04-14 17:46:33.693811+02
084e0a94-5202-4048-b2c7-1d3148f9790c	3e96b760-c3b2-4c92-991c-36d7bca06832	preparing	\N	Status updated by restaurant to preparing	2026-04-14 17:47:05.328237+02
42e7cbb7-be17-4934-a49c-5448d712d497	3e96b760-c3b2-4c92-991c-36d7bca06832	out_for_delivery	\N	Driver accepted the delivery request	2026-04-14 17:47:18.742909+02
7ae09c41-22c2-42cf-a5c6-ffe60e95efe2	4c702736-5a2a-4681-875c-6da304f5e7b1	pending	fb907c54-431d-4d12-ab51-7c61d954ee15	Order created from checkout	2026-04-14 20:14:05.455799+02
370f0b1b-95c4-4190-88ae-58211e74684a	4c702736-5a2a-4681-875c-6da304f5e7b1	preparing	\N	Status updated by restaurant to preparing	2026-04-14 20:14:15.21476+02
9491a42a-8891-4321-a42f-508698a98ba1	4c702736-5a2a-4681-875c-6da304f5e7b1	out_for_delivery	\N	Driver accepted the delivery request	2026-04-14 20:14:34.410765+02
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, customer_id, restaurant_id, assigned_driver_id, status, payment_method, payment_status, subtotal, delivery_fee, service_fee, tax_amount, discount_amount, total_amount, item_count, promo_code, coupon_id, delivery_address_id, delivery_line1, delivery_line2, delivery_city, delivery_state, delivery_postal_code, delivery_country_code, delivery_latitude, delivery_longitude, delivery_notes, placed_at, estimated_delivery_at, accepted_at, prepared_at, out_for_delivery_at, delivered_at, cancelled_at, cancel_reason) FROM stdin;
cccccccc-cccc-cccc-cccc-ccccccccc001	ORD-2451	55555555-5555-5555-5555-555555555551	77777777-7777-7777-7777-777777777771	44444444-4444-4444-4444-444444444441	preparing	card	authorized	24.50	2.99	0.99	2.25	0.00	30.73	3	\N	\N	66666666-6666-6666-6666-666666666551	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-02-24 21:49:53.46781+02	2026-02-24 22:34:53.46781+02	\N	\N	\N	\N	\N	\N
cccccccc-cccc-cccc-cccc-ccccccccc002	ORD-2450	55555555-5555-5555-5555-555555555552	77777777-7777-7777-7777-777777777772	44444444-4444-4444-4444-444444444442	out_for_delivery	cash	pending	18.99	1.99	0.99	1.76	0.00	23.73	2	\N	\N	66666666-6666-6666-6666-666666666552	45 Madison Ave	\N	New York	NY	10010	US	\N	\N	\N	2026-02-24 21:34:53.46781+02	2026-02-24 22:24:53.46781+02	\N	\N	2026-02-24 22:06:53.46781+02	\N	\N	\N
cccccccc-cccc-cccc-cccc-ccccccccc003	ORD-2449	55555555-5555-5555-5555-555555555553	77777777-7777-7777-7777-777777777773	\N	ready_for_delivery	wallet	paid	32.50	2.49	0.99	2.88	5.00	33.86	5	SAVE5	bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb002	66666666-6666-6666-6666-666666666553	89 Broadway	\N	New York	NY	10012	US	\N	\N	\N	2026-02-24 21:19:53.46781+02	2026-02-24 22:19:53.46781+02	\N	\N	\N	\N	\N	\N
21029cd1-eb88-4520-9178-8bb78d3c30c7	ORD-33283892334	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	card	pending	16.99	4.99	0.99	1.36	0.00	24.33	1	\N	\N	\N	Address TBD	\N	New York	NY	10001	US	\N	\N	\N	2026-03-02 08:34:43.889306+02	2026-03-02 09:09:43.889306+02	\N	\N	\N	\N	\N	\N
3b5aecfe-fb0d-440b-bd6f-a6596b6b64cc	ORD-33342164219	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	card	pending	16.99	4.99	0.99	1.36	0.00	24.33	1	\N	\N	\N	Address TBD	\N	New York	NY	10001	US	\N	\N	\N	2026-03-02 08:35:42.164127+02	2026-03-02 09:10:42.164127+02	\N	\N	\N	\N	\N	\N
4e68536f-777c-43cf-acc1-47d473df3977	ORD-33589108546	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	16.99	4.99	0.99	1.36	0.00	24.33	1	\N	\N	\N	Address TBD	\N	New York	NY	10001	US	\N	\N	\N	2026-03-02 08:39:49.116477+02	2026-03-02 09:14:49.116477+02	\N	\N	\N	\N	\N	\N
19e6c5a2-3375-48de-8448-6319b6a7fda2	ORD-33658386698	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	0.01	4.99	0.99	0.00	0.00	5.99	1	\N	\N	\N	Address TBD	\N	New York	NY	10001	US	\N	\N	\N	2026-03-02 08:40:58.386608+02	2026-03-02 09:15:58.386608+02	\N	\N	\N	\N	\N	\N
18ca9e90-9d65-47c8-bab5-1258e8c76eb3	ORD-26243187	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	card	authorized	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-03-17 22:44:22.422646+02	2026-03-17 23:19:22.43+02	\N	\N	\N	\N	\N	\N
1b861d84-69a0-42ca-94fc-ddd91178bcdc	ORD-78026057	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	14.99	4.99	0.00	1.20	0.00	21.18	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 17:13:00.264218+02	2026-03-18 17:48:00.26+02	\N	\N	\N	\N	\N	\N
e00bc2db-1f0a-493c-bff8-3e36dba76e70	ORD-75805089	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	card	authorized	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-03-17 22:52:38.047276+02	2026-03-17 23:27:38.049+02	\N	\N	\N	\N	\N	\N
b6bf7787-766e-42a9-8115-5d10f9020d2a	ORD-62152732	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	card	authorized	222.00	4.99	0.00	17.76	0.00	244.75	2	\N	\N	\N	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-03-17 23:23:41.524911+02	2026-03-17 23:58:41.527+02	\N	\N	\N	\N	\N	\N
ed22d00c-5b85-463f-82af-5a4ac3ab810e	ORD-71381075	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	card	authorized	11.00	4.99	0.00	0.88	0.00	16.87	1	\N	\N	\N	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-03-17 22:51:53.800248+02	2026-03-17 23:26:53.81+02	\N	\N	\N	\N	\N	\N
75e2e505-7d0c-40ac-8512-972d8175ff72	ORD-43936050	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 17:23:59.365183+02	2026-03-18 17:58:59.36+02	\N	\N	\N	\N	\N	\N
881eed9a-b05f-4619-bdbf-96157f0b0dd6	ORD-73446736	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	delivered	card	authorized	222.00	4.99	0.00	17.76	0.00	244.75	2	\N	\N	\N	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	\N	2026-03-17 23:25:34.465609+02	2026-03-18 00:00:34.467+02	\N	\N	\N	\N	\N	\N
d635f29a-661f-4365-8125-41fb128a7554	ORD-77385234	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	out_for_delivery	card	authorized	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-17 23:42:53.848383+02	2026-03-18 00:17:53.852+02	\N	\N	\N	\N	\N	\N
67e986cc-add7-4e1f-83df-a667b5c41b95	ORD-61757279	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	delivered	cash	pending	444.00	4.99	0.00	35.52	0.00	484.51	4	\N	\N	\N	rfmklwmfk	\N	wfcef	fwef	65432	US	\N	\N	Phone: 031424132	2026-03-17 23:56:57.572924+02	2026-03-18 00:31:57.572+02	\N	\N	\N	\N	\N	\N
de2a2338-aafc-46e5-b8a3-fd25a1d2d567	ORD-11071654	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	pending	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 23:41:50.709304+02	2026-03-19 00:16:50.716+02	\N	\N	\N	\N	\N	\N
e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	ORD-58001291	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	cancelled	cash	pending	222.00	4.99	0.00	17.76	0.00	244.75	2	\N	\N	\N	rklmfcdwm	\N	csdc	cdsac	5432	US	\N	\N	Phone: 031424132	2026-03-18 00:13:00.005326+02	2026-03-18 00:48:00.012+02	\N	\N	\N	\N	\N	\N
1c8958de-cc4f-4f38-936a-700ae2f9ae38	ORD-90765917	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	delivered	cash	pending	333.00	4.99	0.00	26.64	0.00	364.63	3	\N	\N	\N	kcmwdlcm	\N	cdsc	csd	4321	US	\N	\N	Phone: 031424132	2026-03-18 00:18:27.660982+02	2026-03-18 00:53:27.659+02	\N	\N	\N	\N	\N	\N
43a405f1-c08b-4d23-9173-2baab0b4ef07	ORD-24792547	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	delivered	cash	pending	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	yfgj	\N	klml	kmlm	9099	US	\N	\N	Phone: 031424132	2026-03-18 00:24:07.919531+02	2026-03-18 00:59:07.925+02	\N	\N	\N	\N	\N	\N
337379e7-8896-46eb-a1c0-a542fc2c64e3	ORD-69402524	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	lkmdx	\N	dkmx	x	789	US	\N	\N	Phone: 031424132	2026-03-18 00:31:34.022625+02	2026-03-18 01:06:34.024+02	\N	\N	\N	\N	\N	\N
91bffd30-78d1-433c-b776-06fbc068c885	ORD-77625453	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 00:32:56.250527+02	2026-03-18 01:07:56.254+02	\N	\N	\N	\N	\N	\N
bde2c155-2079-421c-bd0a-0cf01d0cd2e4	ORD-96386531	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	jndcl	\N	d;slxk ,c	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 00:36:03.869702+02	2026-03-18 01:11:03.865+02	\N	\N	\N	\N	\N	\N
60e94698-b2c0-467e-a641-0d21a21ca821	ORD-99168331	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	pending	cash	pending	111.00	4.99	0.00	8.88	0.00	124.87	1	\N	\N	\N	rfmklwmfk	\N	wfcef	fwef	65432	US	\N	\N	Phone: 031424132	2026-03-18 00:36:31.687457+02	2026-03-18 01:11:31.683+02	\N	\N	\N	\N	\N	\N
371e6e66-c566-4daa-968e-f422bd8defa7	ORD-61789550	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777771	\N	delivered	cash	pending	13.99	4.99	0.00	1.12	0.00	20.10	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 01:20:17.889493+02	2026-03-18 01:55:17.895+02	\N	\N	\N	\N	\N	\N
ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	ORD-87065748	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 02:47:50.651469+02	2026-03-18 03:22:50.657+02	\N	\N	\N	\N	\N	\N
b1f0eed2-7802-4124-a142-318f00e52406	ORD-67529099	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 03:01:15.288649+02	2026-03-18 03:36:15.289+02	\N	\N	\N	\N	\N	\N
1b8caa60-cf6e-468d-beb9-2fc06b37c412	ORD-13410293	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 03:08:54.097637+02	2026-03-18 03:43:54.102+02	\N	\N	\N	\N	\N	\N
16a694af-b921-413e-a69c-12f2af3ed552	ORD-56283885	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 03:16:02.833506+02	2026-03-18 03:51:02.838+02	\N	\N	\N	\N	\N	\N
b3b58535-a283-4db7-9afc-193afd2fe896	ORD-92058081	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	dscmk	3386229b-8c9c-477b-a882-12869845fbc1	\N	Iskandar	\N	Alexandria	Egypt	456789	US	\N	\N	Phone: 11122334	2026-03-18 03:22:00.575416+02	2026-03-18 03:57:00.58+02	\N	\N	\N	\N	\N	\N
4e53674a-1863-4335-a275-079f6c0a7b90	ORD-47738925	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	rfmklwmfk	\N	wfcef	fwef	65432	US	\N	\N	Phone: 031424132	2026-03-18 05:27:57.38322+02	2026-03-18 06:02:57.389+02	\N	\N	\N	\N	\N	\N
8cae2968-6b44-4e50-a5b7-b9751b882f11	ORD-28543016	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	delivered	card	authorized	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 05:41:25.420729+02	2026-03-18 06:16:25.43+02	\N	\N	\N	\N	\N	\N
884e49ca-a80a-4398-9e8e-1491bc123ef4	ORD-07582559	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777772	\N	delivered	cash	pending	46.98	4.99	0.00	3.76	0.00	55.73	2	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 16:11:15.817944+02	2026-03-18 16:46:15.824+02	\N	\N	\N	\N	\N	\N
56e4c7ed-37a0-4903-b60e-5a200db697ce	ORD-46723181	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777772	\N	delivered	card	authorized	25.99	4.99	0.00	2.08	0.00	33.06	1	Off10	0553b135-f84b-4d08-8b21-663ab6712af2	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 16:17:47.225739+02	2026-03-18 16:52:47.231+02	\N	\N	\N	\N	\N	\N
958c84c6-62ea-4a98-a7b8-8036f009315b	ORD-77069257	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777772	\N	delivered	card	authorized	22.99	4.99	0.00	1.84	0.00	29.82	1	Off10	0553b135-f84b-4d08-8b21-663ab6712af2	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 16:39:30.684431+02	2026-03-18 17:14:30.692+02	\N	\N	\N	\N	\N	\N
e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	ORD-89151872	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	12.99	4.99	0.00	1.04	0.00	19.02	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 17:31:31.514844+02	2026-03-18 18:06:31.518+02	\N	\N	\N	2026-03-18 17:34:05.111314+02	\N	\N
f73ef295-6c1e-4f6a-857a-e42410e0b5f3	ORD-29271621	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	csasa	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 17:38:12.716611+02	2026-03-18 18:13:12.716+02	\N	\N	\N	2026-03-18 23:33:17.43731+02	\N	\N
4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	ORD-21510174	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	out_for_delivery	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-18 23:43:35.094987+02	2026-03-19 00:18:35.101+02	\N	\N	\N	\N	\N	\N
f032d0a2-7461-45ba-818a-b8b1e6ea5199	ORD-40924763	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	out_for_delivery	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 031424132	2026-03-19 00:03:29.247698+02	2026-03-19 00:38:29.247+02	\N	\N	\N	\N	\N	\N
1ed3252d-776d-4d4c-b4be-8efcd4c85e21	ORD-45769858	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	dlk	d258f56a-db0f-4152-a31a-7c57ea40db52	\N	rfmklwmfk	\N	wfcef	fwef	65432	US	\N	\N	Phone: 031424132	2026-03-18 23:30:57.689543+02	2026-03-19 00:05:57.698+02	\N	\N	\N	2026-04-07 18:23:58.748305+02	\N	\N
674fb0d0-f621-4733-9f68-6f7ee183dacc	ORD-04273167	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	out_for_delivery	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 01234567890	2026-04-07 20:04:02.730803+02	2026-04-07 20:39:02.73+02	\N	\N	\N	\N	\N	\N
cd209695-2a4b-4bec-81d6-cf37d188ea33	ORD-31733052	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	delivered	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 1222233333	2026-04-07 20:08:37.326928+02	2026-04-07 20:43:37.33+02	\N	\N	\N	2026-04-07 20:27:53.100829+02	\N	\N
3e96b760-c3b2-4c92-991c-36d7bca06832	ORD-59368442	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	out_for_delivery	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 1222233333	2026-04-14 17:46:33.693811+02	2026-04-14 18:21:33.684+02	\N	\N	\N	\N	\N	\N
4c702736-5a2a-4681-875c-6da304f5e7b1	ORD-44546495	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	out_for_delivery	cash	pending	16.99	4.99	0.00	1.36	0.00	23.34	1	\N	\N	\N	Iskandar Ibrahim	\N	Alexandria	Egypt	54322	US	\N	\N	Phone: 1222233333	2026-04-14 20:14:05.455799+02	2026-04-14 20:49:05.464+02	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, method, status, provider, provider_txn_ref, amount, currency, is_cash_collected, paid_at, created_at, updated_at) FROM stdin;
12121212-1212-1212-1212-121212121201	cccccccc-cccc-cccc-cccc-ccccccccc001	card	authorized	\N	\N	30.73	USD	f	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
12121212-1212-1212-1212-121212121202	cccccccc-cccc-cccc-cccc-ccccccccc002	cash	pending	\N	\N	23.73	USD	f	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
12121212-1212-1212-1212-121212121203	cccccccc-cccc-cccc-cccc-ccccccccc003	wallet	paid	\N	\N	33.86	USD	f	2026-02-24 21:24:53.46781+02	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
0ee33cb6-95c3-4562-949a-cec443acdb3d	18ca9e90-9d65-47c8-bab5-1258e8c76eb3	card	authorized	\N	\N	124.87	USD	f	\N	2026-03-17 22:44:22.422646+02	2026-03-17 22:44:22.422646+02
a902e67a-1b7f-4bad-b328-3e782707152f	ed22d00c-5b85-463f-82af-5a4ac3ab810e	card	authorized	\N	\N	16.87	USD	f	\N	2026-03-17 22:51:53.800248+02	2026-03-17 22:51:53.800248+02
4bd1e62f-2049-4a16-aa57-33ff8a6f3b13	e00bc2db-1f0a-493c-bff8-3e36dba76e70	card	authorized	\N	\N	124.87	USD	f	\N	2026-03-17 22:52:38.047276+02	2026-03-17 22:52:38.047276+02
4b65ab8e-1be4-44b9-b20f-23f126d29f7f	b6bf7787-766e-42a9-8115-5d10f9020d2a	card	authorized	\N	\N	244.75	USD	f	\N	2026-03-17 23:23:41.524911+02	2026-03-17 23:23:41.524911+02
646b4d0f-3442-4bd1-862e-b7b06df92b3e	881eed9a-b05f-4619-bdbf-96157f0b0dd6	card	authorized	\N	\N	244.75	USD	f	\N	2026-03-17 23:25:34.465609+02	2026-03-17 23:25:34.465609+02
6491c423-1f9b-4bdf-b9b5-9ae5e610232d	d635f29a-661f-4365-8125-41fb128a7554	card	authorized	\N	\N	124.87	USD	f	\N	2026-03-17 23:42:53.848383+02	2026-03-17 23:42:53.848383+02
4985cf2f-4c17-43c1-bf9f-1b22b2b83c24	67e986cc-add7-4e1f-83df-a667b5c41b95	cash	pending	\N	\N	484.51	USD	f	\N	2026-03-17 23:56:57.572924+02	2026-03-17 23:56:57.572924+02
7a2e683e-551a-42bf-8e8b-80a3df8b9656	e25f6fa9-dbe4-4fc2-a11e-175ca922afd0	cash	pending	\N	\N	244.75	USD	f	\N	2026-03-18 00:13:00.005326+02	2026-03-18 00:13:00.005326+02
473341ff-4a5e-4e52-a18a-b154f2407f39	1c8958de-cc4f-4f38-936a-700ae2f9ae38	cash	pending	\N	\N	364.63	USD	f	\N	2026-03-18 00:18:27.660982+02	2026-03-18 00:18:27.660982+02
9995db46-f8cd-43b4-8d0b-d52c69be4db7	43a405f1-c08b-4d23-9173-2baab0b4ef07	cash	pending	\N	\N	124.87	USD	f	\N	2026-03-18 00:24:07.919531+02	2026-03-18 00:24:07.919531+02
d19660e2-3d7e-44e0-9ecb-120e96296a5f	337379e7-8896-46eb-a1c0-a542fc2c64e3	cash	pending	\N	\N	124.87	USD	f	\N	2026-03-18 00:31:34.022625+02	2026-03-18 00:31:34.022625+02
71d769f1-d8be-4aa2-95da-eb869a68e250	91bffd30-78d1-433c-b776-06fbc068c885	cash	pending	\N	\N	124.87	USD	f	\N	2026-03-18 00:32:56.250527+02	2026-03-18 00:32:56.250527+02
281567e3-d32d-4ad1-94ef-cd39e863d89c	bde2c155-2079-421c-bd0a-0cf01d0cd2e4	cash	pending	\N	\N	124.87	USD	f	\N	2026-03-18 00:36:03.869702+02	2026-03-18 00:36:03.869702+02
cf995b8b-f418-4a36-b513-4b6266f521df	60e94698-b2c0-467e-a641-0d21a21ca821	cash	pending	\N	\N	124.87	USD	f	\N	2026-03-18 00:36:31.687457+02	2026-03-18 00:36:31.687457+02
c452e9fa-4b60-493a-b193-49adbeec82b7	371e6e66-c566-4daa-968e-f422bd8defa7	cash	pending	\N	\N	20.10	USD	f	\N	2026-03-18 01:20:17.889493+02	2026-03-18 01:20:17.889493+02
22c31238-8abe-4b26-b283-7a3cb1426e33	ec1eddb3-cf1b-4cdd-8476-913bc6ba456b	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 02:47:50.651469+02	2026-03-18 02:47:50.651469+02
20ab39f8-1df6-486e-99ed-97c036838037	b1f0eed2-7802-4124-a142-318f00e52406	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 03:01:15.288649+02	2026-03-18 03:01:15.288649+02
698cea80-8905-4b3f-8047-04947323dd77	1b8caa60-cf6e-468d-beb9-2fc06b37c412	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 03:08:54.097637+02	2026-03-18 03:08:54.097637+02
8346df87-8631-4b7b-b441-7c1d7f34dbe6	16a694af-b921-413e-a69c-12f2af3ed552	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 03:16:02.833506+02	2026-03-18 03:16:02.833506+02
fe088265-ae00-4597-b37a-76b9c8891fba	b3b58535-a283-4db7-9afc-193afd2fe896	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 03:22:00.575416+02	2026-03-18 03:22:00.575416+02
0f1ce631-f4b4-4f39-80cb-291f628019d0	4e53674a-1863-4335-a275-079f6c0a7b90	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 05:27:57.38322+02	2026-03-18 05:27:57.38322+02
da34c947-87be-445a-b956-3e3e9eeaa967	8cae2968-6b44-4e50-a5b7-b9751b882f11	card	authorized	\N	\N	23.34	USD	f	\N	2026-03-18 05:41:25.420729+02	2026-03-18 05:41:25.420729+02
ecd75468-445f-4a74-83c7-a1639a272560	884e49ca-a80a-4398-9e8e-1491bc123ef4	cash	pending	\N	\N	55.73	USD	f	\N	2026-03-18 16:11:15.817944+02	2026-03-18 16:11:15.817944+02
f331d33b-d6ab-46ca-856a-2cf40ff14090	56e4c7ed-37a0-4903-b60e-5a200db697ce	card	authorized	\N	\N	33.06	USD	f	\N	2026-03-18 16:17:47.225739+02	2026-03-18 16:17:47.225739+02
f2697c4c-13ff-46d1-94f3-2d3d574445d4	958c84c6-62ea-4a98-a7b8-8036f009315b	card	authorized	\N	\N	29.82	USD	f	\N	2026-03-18 16:39:30.684431+02	2026-03-18 16:39:30.684431+02
944d15f8-d45f-4842-b1b7-d3bc26e2ddf1	1b861d84-69a0-42ca-94fc-ddd91178bcdc	cash	pending	\N	\N	21.18	USD	f	\N	2026-03-18 17:13:00.264218+02	2026-03-18 17:13:00.264218+02
473437ce-76aa-4879-89c3-ae356eabde30	75e2e505-7d0c-40ac-8512-972d8175ff72	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 17:23:59.365183+02	2026-03-18 17:23:59.365183+02
728c30a4-1547-4eef-b025-1662a74f3932	e84bfe3b-bc11-4803-875e-19f2a6ea6fdd	cash	pending	\N	\N	19.02	USD	f	\N	2026-03-18 17:31:31.514844+02	2026-03-18 17:31:31.514844+02
8daa1e41-2036-493c-8c53-eda2eaccc1dd	f73ef295-6c1e-4f6a-857a-e42410e0b5f3	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 17:38:12.716611+02	2026-03-18 17:38:12.716611+02
6e4c8549-56f5-41b9-b55e-1b4726c08dfe	1ed3252d-776d-4d4c-b4be-8efcd4c85e21	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 23:30:57.689543+02	2026-03-18 23:30:57.689543+02
8a6e9ed0-4ed9-451b-9324-8fe13e408736	de2a2338-aafc-46e5-b8a3-fd25a1d2d567	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 23:41:50.709304+02	2026-03-18 23:41:50.709304+02
b7b0e348-184f-4000-b9e5-fa9459f40a4c	4d5301e8-b0e7-43e7-982e-ba9ea67a70bf	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-18 23:43:35.094987+02	2026-03-18 23:43:35.094987+02
6aa98474-96c9-4bd6-9df0-729c4db2be83	f032d0a2-7461-45ba-818a-b8b1e6ea5199	cash	pending	\N	\N	23.34	USD	f	\N	2026-03-19 00:03:29.247698+02	2026-03-19 00:03:29.247698+02
2822251d-b74c-4f49-b5cf-e214a8cc17b0	674fb0d0-f621-4733-9f68-6f7ee183dacc	cash	pending	\N	\N	23.34	USD	f	\N	2026-04-07 20:04:02.730803+02	2026-04-07 20:04:02.730803+02
601f336e-c50f-491e-8b74-3babf2533406	cd209695-2a4b-4bec-81d6-cf37d188ea33	cash	pending	\N	\N	23.34	USD	f	\N	2026-04-07 20:08:37.326928+02	2026-04-07 20:08:37.326928+02
04c06b54-87b8-4fe6-bb0c-abbd7e6da4a1	3e96b760-c3b2-4c92-991c-36d7bca06832	cash	pending	\N	\N	23.34	USD	f	\N	2026-04-14 17:46:33.693811+02	2026-04-14 17:46:33.693811+02
eea523b9-5eb0-4bf5-865f-6dfac34e98a5	4c702736-5a2a-4681-875c-6da304f5e7b1	cash	pending	\N	\N	23.34	USD	f	\N	2026-04-14 20:14:05.455799+02	2026-04-14 20:14:05.455799+02
\.


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_settings (id, platform_name, platform_email, platform_phone, currency, timezone, restaurant_commission_pct, delivery_commission_pct, base_delivery_fee, delivery_fee_per_km, max_delivery_radius_km, min_order_amount, service_fee, tax_rate_pct, email_notifications, sms_notifications, push_notifications, two_factor_auth, session_timeout_minutes, updated_by_user_id, updated_at) FROM stdin;
1	MealGo	support@mealgo.com	+12025550001	USD	America/New_York	15.00	10.00	2.99	0.50	10.00	10.00	0.99	8.00	t	f	t	f	30	11111111-1111-1111-1111-111111111111	2026-02-24 22:14:53.46781+02
\.


--
-- Data for Name: restaurant_cuisines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_cuisines (restaurant_id, cuisine_id) FROM stdin;
77777777-7777-7777-7777-777777777771	88888888-8888-8888-8888-888888888801
77777777-7777-7777-7777-777777777771	88888888-8888-8888-8888-888888888803
77777777-7777-7777-7777-777777777772	88888888-8888-8888-8888-888888888804
77777777-7777-7777-7777-777777777773	88888888-8888-8888-8888-888888888805
\.


--
-- Data for Name: restaurant_staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant_staff (id, restaurant_id, user_id, staff_role, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurants (id, owner_user_id, name, email, phone, description, address_line1, address_line2, city, state, postal_code, country_code, latitude, longitude, status, rating_avg, rating_count, delivery_fee, min_order_amount, eta_min_minutes, eta_max_minutes, created_at, updated_at, deleted_at, image_url) FROM stdin;
77777777-7777-7777-7777-777777777771	33333333-3333-3333-3333-333333333331	Pizza&Pasta	pizza@gmail.com	+12025551001	\N	12 Saad Zaghloul Square	\N	Alexandria	Alexandria	21519	EG	\N	\N	active	4.80	240	2.99	10.00	20	30	2026-02-24 22:14:53.46781+02	2026-04-14 17:31:30.819153+02	\N	data:image/webp;base64,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
77777777-7777-7777-7777-777777777772	33333333-3333-3333-3333-333333333332	Dessert	dessert@gmail.com	01234567890	\N	24 Khaled Ibn El Walid Street, Sidi Bishr	\N	Alexandria	Alexandria	21624	EG	\N	\N	active	5.00	2	1.99	12.00	25	35	2026-02-24 22:14:53.46781+02	2026-04-14 17:31:30.883526+02	\N	\N
77777777-7777-7777-7777-777777777773	33333333-3333-3333-3333-333333333333	Sushi	sushi@gmail.com	+12025551003	\N	18 Fouad Street, El Attarin	\N	Alexandria	Alexandria	21563	EG	\N	\N	active	4.70	180	2.49	10.00	25	35	2026-02-24 22:14:53.46781+02	2026-04-14 17:31:30.885216+02	\N	data:image/webp;base64,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
bf4292b2-add9-4e49-be90-32781bc4ee65	f90f793a-98b3-4e5f-bcc0-d26af5eb296f	Burger	sara.nabil77777@gmail.com	4567890999	\N	33 Ahmed Shawky Street, Gleem	\N	Alexandria	Alexandria	21532	EG	\N	\N	active	4.67	3	0.00	0.00	\N	\N	2026-03-17 01:42:58.045543+02	2026-04-14 17:31:30.886086+02	\N	https://th.bing.com/th/id/OIP.VWOLOVJArWMc-Xwk-2c0pQHaE8?w=291&h=194&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, order_id, customer_id, restaurant_id, driver_id, food_rating, driver_rating, comment, created_at) FROM stdin;
16161616-1616-1616-1616-161616161601	cccccccc-cccc-cccc-cccc-ccccccccc003	55555555-5555-5555-5555-555555555553	77777777-7777-7777-7777-777777777773	\N	5	\N	Great taste and fast preparation	2026-02-24 22:14:53.46781+02
9599dd01-a73f-4d33-9cd6-faca2f2ea216	16a694af-b921-413e-a69c-12f2af3ed552	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	5	\N	Thanks, it was so delicious.	2026-03-18 03:16:58.619724+02
5649dfe0-7c0d-4419-8d3d-7cd602f0e588	b3b58535-a283-4db7-9afc-193afd2fe896	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	4	\N	Amazing.	2026-03-18 03:22:29.541304+02
f266e6af-0fdf-4e8f-8a4d-2754d05e7a8f	8cae2968-6b44-4e50-a5b7-b9751b882f11	fb907c54-431d-4d12-ab51-7c61d954ee15	bf4292b2-add9-4e49-be90-32781bc4ee65	\N	5	\N	Nice	2026-03-18 05:42:34.839706+02
254235d0-43d1-41f3-8771-f9aa1519ed4b	884e49ca-a80a-4398-9e8e-1491bc123ef4	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777772	\N	5	\N	Nice	2026-03-18 16:13:01.676127+02
b5aa5606-6457-492f-b8fb-b2b9014ca991	958c84c6-62ea-4a98-a7b8-8036f009315b	fb907c54-431d-4d12-ab51-7c61d954ee15	77777777-7777-7777-7777-777777777772	\N	5	\N	Thanks	2026-03-18 16:40:28.662186+02
\.


--
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_ticket_messages (id, ticket_id, sender_user_id, message, created_at) FROM stdin;
15151515-1515-1515-1515-151515151501	14141414-1414-1414-1414-141414141401	55555555-5555-5555-5555-555555555551	I did not receive my order yet.	2026-02-24 20:14:53.46781+02
15151515-1515-1515-1515-151515151502	14141414-1414-1414-1414-141414141402	22222222-2222-2222-2222-222222222221	We are checking your transaction with the payment provider.	2026-02-24 21:14:53.46781+02
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, ticket_number, subject, customer_id, order_id, category, priority, status, assigned_to_user_id, created_at, updated_at, closed_at) FROM stdin;
14141414-1414-1414-1414-141414141401	TKT-1234	Order not delivered	55555555-5555-5555-5555-555555555551	cccccccc-cccc-cccc-cccc-ccccccccc001	delivery	high	open	\N	2026-02-24 20:14:53.46781+02	2026-02-24 21:44:53.46781+02	\N
14141414-1414-1414-1414-141414141402	TKT-1233	Payment failed but amount deducted	55555555-5555-5555-5555-555555555552	cccccccc-cccc-cccc-cccc-ccccccccc002	payment	urgent	in_progress	22222222-2222-2222-2222-222222222221	2026-02-24 17:14:53.46781+02	2026-02-24 21:14:53.46781+02	\N
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, user_id, label, line1, line2, city, state, postal_code, country_code, latitude, longitude, is_default, created_at, updated_at) FROM stdin;
66666666-6666-6666-6666-666666666551	55555555-5555-5555-5555-555555555551	home	123 Main Street, Apt 4B	\N	New York	NY	10001	US	\N	\N	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
66666666-6666-6666-6666-666666666552	55555555-5555-5555-5555-555555555552	home	45 Madison Ave	\N	New York	NY	10010	US	\N	\N	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
66666666-6666-6666-6666-666666666553	55555555-5555-5555-5555-555555555553	home	89 Broadway	\N	New York	NY	10012	US	\N	\N	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
66666666-6666-6666-6666-666666666554	55555555-5555-5555-5555-555555555554	home	77 Wall Street	\N	New York	NY	10005	US	\N	\N	t	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, phone, password_hash, role, status, email_verified_at, last_login_at, created_at, updated_at, deleted_at) FROM stdin;
22222222-2222-2222-2222-222222222221	Support Agent 1	support1@mealgo.com	+12025550002	seed_hash_support1	support	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
22222222-2222-2222-2222-222222222222	Support Agent 2	support2@mealgo.com	+12025550003	seed_hash_support2	support	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
44444444-4444-4444-4444-444444444441	John Driver	john.driver@example.com	+12025550020	seed_hash_driver1	driver	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
44444444-4444-4444-4444-444444444442	Mike Rider	mike.rider@example.com	+12025550021	seed_hash_driver2	driver	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
44444444-4444-4444-4444-444444444443	Tom Wilson	tom.wilson@example.com	+12025550022	seed_hash_driver3	driver	inactive	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
55555555-5555-5555-5555-555555555552	Sarah Khan	sarah@example.com	+12025550031	seed_hash_customer2	customer	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
55555555-5555-5555-5555-555555555553	Mike Brown C	mike.customer@example.com	+12025550032	seed_hash_customer3	customer	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
55555555-5555-5555-5555-555555555554	Lisa Wong	lisa@example.com	+12025550033	seed_hash_customer4	customer	active	\N	\N	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
752bb71b-9d69-44a8-8ae0-2b9dc9e78587	sara	sara@gmail.com	011111111111	temp_hash_change_me	customer	active	\N	\N	2026-02-24 22:17:57.994896+02	2026-02-24 22:17:57.994896+02	\N
2f9cfe22-d13f-4a8e-bedd-e86fcb83b995	dwq	xsa@gmail.com	+0122223334	temp_hash_change_me	restaurant	active	\N	\N	2026-02-24 22:19:10.580837+02	2026-02-24 22:19:10.580837+02	\N
218d9862-4372-4d1e-b5d9-c74230ca8708	clkdsmc	cmlwkd@gmail.com	+4302984092	temp_hash_change_me	restaurant	active	\N	\N	2026-02-24 22:19:45.528801+02	2026-02-24 22:19:45.528801+02	\N
f3dd2f60-e016-4bb6-bc38-0d7fc5a585e0	cdsc	xas@gmail.com	03223324	temp_hash_change_me	driver	active	\N	\N	2026-02-25 15:39:35.094369+02	2026-02-25 15:39:35.094369+02	\N
e730e441-87d9-4d89-b9ad-84f231cb9523	csam 	cmdsc@gmail.com	056323534	temp_hash_change_me	restaurant	active	\N	\N	2026-02-25 15:39:59.552918+02	2026-02-25 15:39:59.552918+02	\N
825ec8b8-073e-4637-8d14-3ea99c812148	ldskvm	vnkclwd@gmail.com	904823984	temp_hash_change_me	restaurant	active	\N	\N	2026-02-25 15:59:03.532506+02	2026-02-25 15:59:03.532506+02	\N
6560cf5c-e1f6-4c06-9d62-55ff273c5d5e	cskldmc	kalmd@gmail.com	57687893	temp_hash_change_me	restaurant	active	\N	\N	2026-02-25 16:54:02.379792+02	2026-02-25 16:54:02.379792+02	\N
55555555-5555-5555-5555-555555555551	Ahmad Ali	ahmad@example.com	+12025550030	seed_hash_customer1	customer	active	\N	2026-03-02 07:07:02.089091+02	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
bf31eb02-2cc9-4fc5-928c-d2bd11f934c1	Sara Tahawy	sara.tahawy123@gmail.com	+1 234 567 8900	scrypt$3ae3e71fb1a7b52d59d46b0037b32e50$7cbcc4ced00563cb2bea81b7937d5b41d1d1a3e8f9de4857000a4913bea294eb93fad8113663ce99763ef526cc14e3a64c8d5b7b2e77a3453147ec45304937d6	driver	active	\N	2026-04-14 17:41:45.550762+02	2026-03-17 01:46:53.604849+02	2026-03-18 18:05:40.409429+02	\N
33333333-3333-3333-3333-333333333333	Hager	sushi@gmail.com	+12025551003	seed_hash_rest_owner3	restaurant	active	\N	2026-03-19 00:35:39.159806+02	2026-02-24 22:14:53.46781+02	2026-03-18 02:18:49.524714+02	\N
11111111-1111-1111-1111-111111111111	System Admin	admin@mealgo.com	+12025550001	seed_hash_admin	admin	active	\N	2026-04-14 17:42:24.720458+02	2026-02-24 22:14:53.46781+02	2026-02-24 22:14:53.46781+02	\N
4f3c089f-b5c1-4235-b374-2d9f95ee60ae	Gramercy Tavern	gramercy@gmail.com	\N	scrypt$cd92b399723a6489016754581d8a5d58$496b59a3b00d3655ad0aa52a8f0a78f9a46e2dc8517fc1893ab629479c20c944af5293edffda1d796773cf2e3676799912ccf788a3475d215716c7d28ac23d94	restaurant	active	\N	2026-03-03 17:57:21.456285+02	2026-03-02 15:40:58.44806+02	2026-03-02 15:40:58.44806+02	\N
33333333-3333-3333-3333-333333333332	Sara	dessert@gmail.com	01234567890	seed_hash_rest_owner2	restaurant	active	\N	2026-03-19 00:36:39.292597+02	2026-02-24 22:14:53.46781+02	2026-03-19 00:41:51.121436+02	\N
e322ec36-ffc9-47ef-9bef-4256038ee76d	Sara	sara3@gmail.com	+2011122334	scrypt$2282f4ad8e65f324b6d2d4e583168efc$5925d17ccc3b7a47662eb28ad46209c1533d0a412538faea4cef569122dc044d4f8dd7c2253d92fc3170f0f01e7519a9558566b0d591e5c1e043307470767198	customer	active	\N	\N	2026-03-17 02:12:09.677837+02	2026-03-18 01:32:14.914728+02	\N
12fca6cc-cfcd-48fa-8c56-0bb7a43cabdf	meat2	meat2@gmail.com	\N	scrypt$bda1ca3bd1256290a4b29e354967ba9c$6fe8baa00c42e27549bff52a4fc619ddc8dd0a18a60f3aff908b2d19d16c3b56fd123d22c7a31b732c4eb0863985ab8fb67f100ded4c643a946ab43a0f547504	restaurant	active	\N	2026-03-18 01:48:01.508017+02	2026-03-17 01:42:02.197065+02	2026-03-17 01:42:02.197065+02	\N
9893e72c-0fbc-4d2b-879b-2b0360a641ec	Sara	sara2@gmail.com	\N	scrypt$11c8281c49ed96f9c6babce012e74643$3a6069bcb0e735faa0f3fdc1cf9bae16aaaf35f99bcc7d029942712a8f90c53531dbb3db7cd1f60d674b1ac27933805a95074f68d4e0dc877d3714d6b87ce580	customer	active	\N	2026-03-18 16:44:53.150405+02	2026-03-17 00:22:59.269056+02	2026-03-17 00:22:59.269056+02	\N
fb907c54-431d-4d12-ab51-7c61d954ee15	Sara Nabil	sara.tahawy11@gmail.com	\N	scrypt$83cbe50dcffe320319647f19e989fa23$695f53a515c09e9212dcd28ff79132c45580115cefe1b24a769f947b9af24a8751a833a31083e0089d3cec20f9ea5fa7a554deba546e7f8ab11307674ae39429	customer	active	\N	2026-04-14 17:31:20.512759+02	2026-03-02 07:28:04.51835+02	2026-03-02 07:28:04.51835+02	\N
f90f793a-98b3-4e5f-bcc0-d26af5eb296f	Sara Nabil  	sara.nabil77777@gmail.com	4567890999	scrypt$61495d3c1fa16a22bac13190f52e10ea$d0bff697db3aef5402f17bdcb571b28462765d07956a4c86e1fc486993bfdb65a3b7cdc51feb0d4737c4f6db564f1c4d63de66952bd0bafec2acc9a15534121a	restaurant	active	\N	2026-04-14 17:41:37.423052+02	2026-03-17 01:42:58.045543+02	2026-03-18 02:25:19.911427+02	\N
33333333-3333-3333-3333-333333333331	Salma	pizza@gmail.com	+12025551001	seed_hash_rest_owner1	restaurant	active	\N	2026-03-19 00:34:35.459666+02	2026-02-24 22:14:53.46781+02	2026-03-18 02:26:40.004157+02	\N
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: chat_responses chat_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_responses
    ADD CONSTRAINT chat_responses_pkey PRIMARY KEY (id);


--
-- Name: coupon_redemptions coupon_redemptions_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_order_id_key UNIQUE (order_id);


--
-- Name: coupon_redemptions coupon_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_pkey PRIMARY KEY (id);


--
-- Name: coupon_restaurants coupon_restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_restaurants
    ADD CONSTRAINT coupon_restaurants_pkey PRIMARY KEY (coupon_id, restaurant_id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: cuisines cuisines_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_name_key UNIQUE (name);


--
-- Name: cuisines cuisines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuisines
    ADD CONSTRAINT cuisines_pkey PRIMARY KEY (id);


--
-- Name: driver_assignments driver_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignments
    ADD CONSTRAINT driver_assignments_pkey PRIMARY KEY (id);


--
-- Name: driver_profiles driver_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT driver_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: driver_profiles driver_profiles_vehicle_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT driver_profiles_vehicle_number_key UNIQUE (vehicle_number);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_restaurant_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_restaurant_id_name_key UNIQUE (restaurant_id, name);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: restaurant_cuisines restaurant_cuisines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_cuisines
    ADD CONSTRAINT restaurant_cuisines_pkey PRIMARY KEY (restaurant_id, cuisine_id);


--
-- Name: restaurant_staff restaurant_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_staff
    ADD CONSTRAINT restaurant_staff_pkey PRIMARY KEY (id);


--
-- Name: restaurant_staff restaurant_staff_restaurant_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_staff
    ADD CONSTRAINT restaurant_staff_restaurant_id_user_id_key UNIQUE (restaurant_id, user_id);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_id_key UNIQUE (order_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: support_ticket_messages support_ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_coupon_redemptions_user_coupon; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupon_redemptions_user_coupon ON public.coupon_redemptions USING btree (user_id, coupon_id);


--
-- Name: idx_coupons_status_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_status_dates ON public.coupons USING btree (status, valid_from, valid_until);


--
-- Name: idx_driver_assignments_driver_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driver_assignments_driver_status ON public.driver_assignments USING btree (driver_user_id, status);


--
-- Name: idx_driver_assignments_order_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driver_assignments_order_status ON public.driver_assignments USING btree (order_id, status);


--
-- Name: idx_driver_profiles_status_availability; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driver_profiles_status_availability ON public.driver_profiles USING btree (status, availability);


--
-- Name: idx_menu_items_restaurant_available; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_menu_items_restaurant_available ON public.menu_items USING btree (restaurant_id, is_available);


--
-- Name: idx_notifications_user_read_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_read_created ON public.notifications USING btree (user_id, is_read, created_at DESC);


--
-- Name: idx_order_history_order_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_history_order_created ON public.order_status_history USING btree (order_id, created_at DESC);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_customer_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_customer_created ON public.orders USING btree (customer_id, placed_at DESC);


--
-- Name: idx_orders_driver_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_driver_status_created ON public.orders USING btree (assigned_driver_id, status, placed_at DESC);


--
-- Name: idx_orders_restaurant_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_restaurant_status_created ON public.orders USING btree (restaurant_id, status, placed_at DESC);


--
-- Name: idx_orders_status_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status_created ON public.orders USING btree (status, placed_at DESC);


--
-- Name: idx_restaurants_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_restaurants_status ON public.restaurants USING btree (status);


--
-- Name: idx_ticket_messages_ticket_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ticket_messages_ticket_created ON public.support_ticket_messages USING btree (ticket_id, created_at);


--
-- Name: idx_tickets_status_priority_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tickets_status_priority_created ON public.support_tickets USING btree (status, priority, created_at DESC);


--
-- Name: idx_users_role_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role_status ON public.users USING btree (role, status);


--
-- Name: ux_user_default_address; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_user_default_address ON public.user_addresses USING btree (user_id) WHERE (is_default = true);


--
-- Name: audit_logs audit_logs_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: coupon_redemptions coupon_redemptions_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE RESTRICT;


--
-- Name: coupon_redemptions coupon_redemptions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: coupon_redemptions coupon_redemptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_redemptions
    ADD CONSTRAINT coupon_redemptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: coupon_restaurants coupon_restaurants_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_restaurants
    ADD CONSTRAINT coupon_restaurants_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE CASCADE;


--
-- Name: coupon_restaurants coupon_restaurants_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupon_restaurants
    ADD CONSTRAINT coupon_restaurants_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: coupons coupons_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: driver_assignments driver_assignments_driver_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignments
    ADD CONSTRAINT driver_assignments_driver_user_id_fkey FOREIGN KEY (driver_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: driver_assignments driver_assignments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_assignments
    ADD CONSTRAINT driver_assignments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: driver_profiles driver_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_profiles
    ADD CONSTRAINT driver_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: orders fk_order_coupon; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_order_coupon FOREIGN KEY (coupon_id) REFERENCES public.coupons(id) ON DELETE SET NULL;


--
-- Name: menu_categories menu_categories_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu_categories(id) ON DELETE SET NULL;


--
-- Name: menu_items menu_items_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_status_history order_status_history_changed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_changed_by_user_id_fkey FOREIGN KEY (changed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_assigned_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_assigned_driver_id_fkey FOREIGN KEY (assigned_driver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: orders orders_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.user_addresses(id) ON DELETE SET NULL;


--
-- Name: orders orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE RESTRICT;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: platform_settings platform_settings_updated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_updated_by_user_id_fkey FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: restaurant_cuisines restaurant_cuisines_cuisine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_cuisines
    ADD CONSTRAINT restaurant_cuisines_cuisine_id_fkey FOREIGN KEY (cuisine_id) REFERENCES public.cuisines(id) ON DELETE CASCADE;


--
-- Name: restaurant_cuisines restaurant_cuisines_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_cuisines
    ADD CONSTRAINT restaurant_cuisines_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: restaurant_staff restaurant_staff_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_staff
    ADD CONSTRAINT restaurant_staff_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: restaurant_staff restaurant_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant_staff
    ADD CONSTRAINT restaurant_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: restaurants restaurants_owner_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: reviews reviews_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE RESTRICT;


--
-- Name: support_ticket_messages support_ticket_messages_sender_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: support_ticket_messages support_ticket_messages_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_ticket_messages
    ADD CONSTRAINT support_ticket_messages_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: support_tickets support_tickets_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: support_tickets support_tickets_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict eEVcHb4r5wXFjgK5aJ6GaZum1dwxxvu5bclO2Xk9bX0kIzBdj3FkkyCvXDl5RrA

