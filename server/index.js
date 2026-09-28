require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { promisify } = require('util');
const { pool } = require('./db');
const ethers = require('ethers');
const nftArtifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');

// blockchain helpers (used by both admin and redemption endpoints)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const rawKey = (process.env.PRIVATE_KEY || '').trim();
console.log('PRIVATE_KEY raw length', rawKey.length, rawKey);
for (let i = 0; i < rawKey.length; i++) {
  const code = rawKey.charCodeAt(i);
  if (code < 32 || code > 126) console.log('Nonprintable char at', i, code);
}
if (!rawKey) {
  throw new Error('PRIVATE_KEY missing from environment');
}
const wallet = new ethers.Wallet(rawKey, provider);
console.log('Using wallet address', wallet.address);
const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, nftArtifact.abi, wallet);

const app = express();
const port = Number(process.env.API_PORT || 4000);
const httpsEnabled = process.env.DEV_HTTPS === 'true';
const httpsPfxPath = path.join(__dirname, '..', process.env.HTTPS_PFX_PATH || 'certs/localhost-dev.pfx');
const httpsPassphrase = process.env.HTTPS_PFX_PASSPHRASE || 'mealgo-dev';
const hasHttpsPfx = fs.existsSync(httpsPfxPath);

// ✅ Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as timestamp');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].timestamp,
      dbConnected: true
    });
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      details: err.message,
      dbConnected: false
    });
  }
});
const scryptAsync = promisify(crypto.scrypt);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@mealgo.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/auth/google/callback';
const oauthStateStore = new Map();
const oauthTicketStore = new Map();

// Enable/disable 2FA for testing, default ON (can be turned off by setting ENABLE_2FA=false in .env)
const ENABLE_2FA = process.env.ENABLE_2FA !== 'false';
const twoFACodes = new Map();
const passwordResetOtps = new Map();

app.use(cors());
app.use(express.json());

// mount admin helper routes (create-coupon mints NFTs + creates DB entry)
const createCouponRoute = require('./createCoupon');
app.use('/api/admin', createCouponRoute);

// expose the coupons list for regular users (same handler, different path)
app.get('/api/user/coupons', createCouponRoute.getUserCouponsHandler);

const isValidGmail = (email) => /^[^\s@]+@gmail\.com$/i.test(email || '');
const isValidPhone = (phone) => /^\+?[0-9\s-]{8,20}$/.test((phone || '').trim());
const extractPhoneFromDeliveryNotes = (notes) => {
  const value = typeof notes === 'string' ? notes : '';
  const match = value.match(/phone:\s*([0-9+\-\s()]+)/i);
  return match ? match[1].trim() : null;
};
const DEFAULT_ALEXANDRIA_RESTAURANT = {
  addressLine1: '45 Corniche Road, Al Raml Station',
  city: 'Alexandria',
  state: 'Alexandria',
  postalCode: '21563',
  countryCode: 'EG',
};
const defaultRestaurantLocationMap = {
  '77777777-7777-7777-7777-777777777771': {
    addressLine1: '12 Saad Zaghloul Square',
    city: 'Alexandria',
    state: 'Alexandria',
    postalCode: '21519',
    countryCode: 'EG',
  },
  '77777777-7777-7777-7777-777777777772': {
    addressLine1: '24 Khaled Ibn El Walid Street, Sidi Bishr',
    city: 'Alexandria',
    state: 'Alexandria',
    postalCode: '21624',
    countryCode: 'EG',
  },
  '77777777-7777-7777-7777-777777777773': {
    addressLine1: '18 Fouad Street, El Attarin',
    city: 'Alexandria',
    state: 'Alexandria',
    postalCode: '21563',
    countryCode: 'EG',
  },
  'bf4292b2-add9-4e49-be90-32781bc4ee65': {
    addressLine1: '33 Ahmed Shawky Street, Gleem',
    city: 'Alexandria',
    state: 'Alexandria',
    postalCode: '21532',
    countryCode: 'EG',
  },
};
const getDefaultRestaurantLocation = (restaurant) => {
  if (restaurant?.id && defaultRestaurantLocationMap[restaurant.id]) {
    return defaultRestaurantLocationMap[restaurant.id];
  }

  const normalizedName = String(restaurant?.name || '').trim().toLowerCase();
  if (normalizedName === 'pizza&pasta' || normalizedName === 'gramercy tavern') {
    return defaultRestaurantLocationMap['77777777-7777-7777-7777-777777777771'];
  }
  if (
    normalizedName === 'dessert' ||
    normalizedName === 'starbucks borobudur' ||
    normalizedName.includes('starbucks')
  ) {
    return defaultRestaurantLocationMap['77777777-7777-7777-7777-777777777772'];
  }
  if (
    normalizedName === 'sushi' ||
    normalizedName === 'baegopa suhat' ||
    normalizedName.includes('baegopa')
  ) {
    return defaultRestaurantLocationMap['77777777-7777-7777-7777-777777777773'];
  }
  if (normalizedName === 'burger') {
    return defaultRestaurantLocationMap['bf4292b2-add9-4e49-be90-32781bc4ee65'];
  }

  return DEFAULT_ALEXANDRIA_RESTAURANT;
};
const normalizeRestaurantRecord = (restaurant) => {
  const defaults = getDefaultRestaurantLocation(restaurant);
  return {
    ...restaurant,
    address_line1: defaults.addressLine1,
    city: defaults.city,
    state: defaults.state,
    postal_code: defaults.postalCode,
    country_code: defaults.countryCode,
  };
};
const normalizeRestaurantAddress = (address) => {
  const value = String(address || '').trim().toLowerCase();
  if (value === 'address tbd, new york') {
    return '45 Corniche Road, Al Raml Station, Alexandria';
  }
  return address;
};
const syncDefaultRestaurantLocations = async () => {
  const entries = Object.entries(defaultRestaurantLocationMap);
  for (const [restaurantId, location] of entries) {
    await pool.query(
      `UPDATE restaurants
       SET address_line1 = $2,
           city = $3,
           state = $4,
           postal_code = $5,
           country_code = $6,
           updated_at = now()
       WHERE id = $1
         AND deleted_at IS NULL`,
      [
        restaurantId,
        location.addressLine1,
        location.city,
        location.state,
        location.postalCode,
        location.countryCode,
      ]
    );
  }
};
syncDefaultRestaurantLocations().catch((error) => {
  console.error('Failed to sync default Alexandria restaurant locations:', error.message);
});
const getPasswordValidationErrors = (password) => {
  const value = typeof password === 'string' ? password : '';
  const errors = [];

  if (value.length < 8) errors.push('at least 8 characters');
  if (!/[A-Z]/.test(value)) errors.push('at least 1 uppercase letter');
  if (!/[a-z]/.test(value)) errors.push('at least 1 lowercase letter');
  if (!/\d/.test(value)) errors.push('at least 1 number');
  if (!/[^A-Za-z0-9]/.test(value)) errors.push('at least 1 special character');

  return errors;
};
const mapUniqueViolation = (error) => {
  if (!error || error.code !== '23505') return null;
  const c = error.constraint || '';
  if (c === 'users_email_key') return 'Email already exists';
  if (c === 'users_phone_key') return 'Phone number already exists';
  if (c === 'coupons_code_key') return 'Coupon code already exists';
  if (c === 'driver_profiles_vehicle_number_key') return 'Vehicle number already exists';
  return 'Duplicate value already exists';
};

const defaultRestaurantImageMap = {
  '77777777-7777-7777-7777-777777777771': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
  '77777777-7777-7777-7777-777777777772': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
  '77777777-7777-7777-7777-777777777773': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
};

const getRestaurantImage = (restaurant) => {
  if (restaurant?.image_url) return restaurant.image_url;
  if (restaurant?.id && defaultRestaurantImageMap[restaurant.id]) {
    return defaultRestaurantImageMap[restaurant.id];
  }

  const raw = `${restaurant?.name || ''} ${restaurant?.email || ''}`.toLowerCase();
  if (raw.includes('pizza') || raw.includes('gramercy')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
  }
  if (raw.includes('starbucks') || raw.includes('coffee')) {
    return 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
  }
  if (raw.includes('baegopa') || raw.includes('korean')) {
    return 'https://images.unsplash.com/photo-1552566626-52f8b828add9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
  }

  return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
};

const toStatusView = (status) => {
  if (status === 'ready_for_delivery') return 'ready';
  if (status === 'out_for_delivery') return 'delivering';
  return status;
};

const toDbOrderStatus = (status) => {
  if (status === 'ready') return 'ready_for_delivery';
  if (status === 'delivering') return 'out_for_delivery';
  return status;
};

const toPaymentMethodDb = (paymentMethod) => {
  if (paymentMethod === 'apple') return 'apple_pay';
  return paymentMethod;
};

const mapApplicableFor = (value) => {
  if (value === 'new_users') return 'new-users';
  return value;
};

const getLegacySeedPasswordByRole = (role) => {
  if (role === 'admin') return ADMIN_PASSWORD;
  if (role === 'restaurant') return 'rest123';
  if (role === 'driver') return 'driver123';
  return 'customer123';
};

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${Buffer.from(derivedKey).toString('hex')}`;
};

const verifyPassword = async (plainPassword, storedHash, role) => {
  if (!plainPassword || !storedHash) return false;

  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const salt = Buffer.from(parts[1], 'hex');
    const expectedHash = Buffer.from(parts[2], 'hex');
    const derivedKey = await scryptAsync(plainPassword, salt, expectedHash.length);
    return crypto.timingSafeEqual(Buffer.from(derivedKey), expectedHash);
  }

  if (storedHash.startsWith('seed_hash_')) {
    return plainPassword === getLegacySeedPasswordByRole(role);
  }

  return plainPassword === storedHash;
};

const fetchUserByEmailAndRole = async (email, role) => {
  const result = await pool.query(
    `SELECT
       u.id,
       u.email,
       u.full_name,
       u.role,
       u.status,
       u.password_hash,
       r.id AS restaurant_id,
       r.name AS restaurant_name,
       d.user_id AS driver_id
     FROM users u
     LEFT JOIN restaurants r ON r.owner_user_id = u.id
     LEFT JOIN driver_profiles d ON d.user_id = u.id
     WHERE LOWER(u.email) = LOWER($1) AND u.role = $2::user_role`,
    [email, role]
  );
  return result.rows[0] || null;
};

const fetchUserById = async (id) => {
  const result = await pool.query(
    `SELECT
       u.id,
       u.email,
       u.full_name,
       u.role,
       u.status,
       u.password_hash,
       r.id AS restaurant_id,
       r.name AS restaurant_name,
       d.user_id AS driver_id
     FROM users u
     LEFT JOIN restaurants r ON r.owner_user_id = u.id
     LEFT JOIN driver_profiles d ON d.user_id = u.id
     WHERE u.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const toAuthPayload = (user) => ({
  id: user.id,
  email: user.email,
  name: user.full_name,
  role: user.role,
  restaurantId: user.restaurant_id || null,
  restaurantName: user.restaurant_name || null,
  driverId: user.driver_id || null,
});

const generateTempVehicleNumber = () =>
  `TMP-${Date.now().toString(36).slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

const createUserWithRole = async ({ name, email, phone, passwordHash, role }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, $5::user_role, 'active'::user_status)
       RETURNING id, email, full_name, role`,
      [name, email, phone || null, passwordHash, role]
    );
    const user = userResult.rows[0];

    let restaurantId = null;
    let restaurantName = null;
    let driverId = null;

    if (role === 'restaurant') {
      const restResult = await client.query(
        `INSERT INTO restaurants (
           owner_user_id, name, email, phone, address_line1, city, state, postal_code, country_code, status
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active'::restaurant_status)
         RETURNING id, name`,
        [
          user.id,
          name,
          email,
          phone || null,
          DEFAULT_ALEXANDRIA_RESTAURANT.addressLine1,
          DEFAULT_ALEXANDRIA_RESTAURANT.city,
          DEFAULT_ALEXANDRIA_RESTAURANT.state,
          DEFAULT_ALEXANDRIA_RESTAURANT.postalCode,
          DEFAULT_ALEXANDRIA_RESTAURANT.countryCode,
        ]
      );
      restaurantId = restResult.rows[0].id;
      restaurantName = restResult.rows[0].name;
    }

    if (role === 'driver') {
      const driverResult = await client.query(
        `INSERT INTO driver_profiles (user_id, vehicle_type, vehicle_number, availability)
         VALUES ($1, 'Motorcycle', $2, 'offline'::availability_status)
         RETURNING user_id`,
        [user.id, generateTempVehicleNumber()]
      );
      driverId = driverResult.rows[0].user_id;
    }

    await client.query('COMMIT');
    return { ...user, restaurant_id: restaurantId, restaurant_name: restaurantName, driver_id: driverId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const ensureAdminUserExists = async () => {
  const existing = await fetchUserByEmailAndRole(ADMIN_EMAIL, 'admin');
  if (existing) return existing;
  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  try {
    await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'admin'::user_role, 'active'::user_status)`,
      ['System Admin', ADMIN_EMAIL, null, passwordHash]
    );
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (!duplicateMessage) throw error;
  }
  return fetchUserByEmailAndRole(ADMIN_EMAIL, 'admin');
};

const ensureRestaurantImageColumn = async () => {
  await pool.query(`
    ALTER TABLE restaurants
    ADD COLUMN IF NOT EXISTS image_url TEXT
  `);
};

const sanitizeClientUrl = (value) => {
  if (!value) return null;

  try {
    const parsed = new URL(value);
    const isLocalhost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1';

    if (!isLocalhost) return null;
    return parsed.origin;
  } catch {
    return null;
  }
};

const getOauthClientUrl = (req) => {
  const originHeader = sanitizeClientUrl(req.get('origin'));
  if (originHeader) return originHeader;

  const refererHeader = req.get('referer');
  if (refererHeader) {
    const refererOrigin = sanitizeClientUrl(refererHeader);
    if (refererOrigin) return refererOrigin;
  }

  return CLIENT_URL;
};

const issueOauthState = ({ mode, role, clientUrl }) => {
  const key = crypto.randomBytes(24).toString('hex');
  oauthStateStore.set(key, {
    mode,
    role,
    clientUrl: sanitizeClientUrl(clientUrl) || CLIENT_URL,
    expiresAt: Date.now() + 15 * 60 * 1000, // Increased from 5 to 15 minutes
  });
  return key;
};

const consumeOauthState = (key) => {
  if (!key) return null;
  const payload = oauthStateStore.get(key);
  oauthStateStore.delete(key);
  if (!payload || payload.expiresAt < Date.now()) return null;
  return payload;
};

const issueOauthTicket = (authPayload) => {
  const ticket = crypto.randomBytes(24).toString('hex');
  oauthTicketStore.set(ticket, { authPayload, expiresAt: Date.now() + 2 * 60 * 1000 });
  return ticket;
};

const consumeOauthTicket = (ticket) => {
  if (!ticket) return null;
  const payload = oauthTicketStore.get(ticket);
  oauthTicketStore.delete(ticket);
  if (!payload || payload.expiresAt < Date.now()) return null;
  return payload.authPayload;
};

const createPasswordResetKey = (email, role) => `${String(email || '').trim().toLowerCase()}::${role}`;

const issuePasswordResetOtp = ({ email, role, userId }) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const key = createPasswordResetKey(email, role);
  passwordResetOtps.set(key, {
    otp,
    userId,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return otp;
};

const consumePasswordResetOtp = ({ email, role, otp }) => {
  const key = createPasswordResetKey(email, role);
  const record = passwordResetOtps.get(key);

  if (!record) {
    return { ok: false, message: 'No OTP found for this account. Please request a new code.' };
  }

  if (record.expiresAt < Date.now()) {
    passwordResetOtps.delete(key);
    return { ok: false, message: 'OTP expired. Please request a new code.' };
  }

  if (record.otp !== String(otp || '').trim()) {
    return { ok: false, message: 'Invalid OTP code' };
  }

  passwordResetOtps.set(key, {
    ...record,
    otp: null,
    verified: true,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
  return { ok: true, userId: record.userId };
};

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/coupons', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();

  const where = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(code ILIKE $${params.length} OR COALESCE(description, '') ILIKE $${params.length})`);
  }

  if (status !== 'all') {
    params.push(status);
    where.push(
      `(
         CASE
           WHEN valid_until < now() THEN 'expired'
           ELSE status::text
         END
       ) = $${params.length}`
    );
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const query = `
    SELECT
      id,
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      max_discount,
      nft_token_id,
      nft_contract_address,
      COALESCE(usage_limit, 0) AS usage_limit,
      usage_count,
      valid_from,
      valid_until,
      CASE
        WHEN valid_until < now() THEN 'expired'
        ELSE status::text
      END AS effective_status,
      applicable_for
    FROM coupons
    ${whereClause}
    ORDER BY created_at DESC
  `;

  try {
    const { rows } = await pool.query(query, params);
    res.json(
      rows.map((row) => ({
        id: row.id,
        code: row.code,
        description: row.description || '',
        discountType: row.discount_type === 'free_delivery' ? 'free-delivery' : row.discount_type,
        discountValue: Number(row.discount_value),
        minOrderValue: Number(row.min_order_value),
        maxDiscount: row.max_discount === null ? undefined : Number(row.max_discount),
        nftTokenId: row.nft_token_id || undefined,
        nftContractAddress: row.nft_contract_address || undefined,
        usageLimit: Number(row.usage_limit),
        usageCount: Number(row.usage_count),
        validFrom: row.valid_from,
        validUntil: row.valid_until,
        status: row.effective_status,
        applicableFor: mapApplicableFor(row.applicable_for),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
  }
});

app.patch('/api/coupons/:id/toggle-status', async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE coupons
    SET status = CASE WHEN status = 'active' THEN 'inactive'::coupon_status ELSE 'active'::coupon_status END,
        updated_at = now()
    WHERE id = $1
      AND status <> 'expired'
      AND valid_until >= now()
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Coupon cannot be toggled (expired or not found)' });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle status', error: error.message });
  }
});

app.delete('/api/coupons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    usageLimit,
    nftTokenId,
    nftContractAddress,
    status = 'active',
    applicableFor = 'all',
    validFrom,
    validUntil,
  } = req.body || {};

  if (!code || !discountType || discountValue === undefined || !validFrom || !validUntil) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const discountTypeDb = discountType === 'free-delivery' ? 'free_delivery' : discountType;
  const applicableForDb = applicableFor === 'new-users' ? 'new_users' : applicableFor;

  const query = `
    INSERT INTO coupons (
      code, description, discount_type, discount_value, min_order_value, max_discount,
      nft_token_id, nft_contract_address,
      usage_limit, usage_count, status, applicable_for, valid_from, valid_until
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10,$11,$12,$13)
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [
      code,
      description || '',
      discountTypeDb,
      Number(discountValue),
      Number(minOrderValue || 0),
      maxDiscount === undefined || maxDiscount === '' ? null : Number(maxDiscount),
      nftTokenId || null,
      nftContractAddress || null,
      usageLimit === undefined || usageLimit === '' ? null : Number(usageLimit),
      status,
      applicableForDb,
      validFrom,
      validUntil,
    ]);
    return res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to create coupon', error: error.message });
  }
});

// ---------------- redemption endpoint ----------------
app.post('/api/coupons/redeem', async (req, res) => {
  const { code, walletAddress, userId, orderId } = req.body || {};
  if (!code || !walletAddress) {
    return res.status(400).json({ message: 'code and walletAddress are required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM coupons WHERE code = $1', [code]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    const coupon = rows[0];

    if (coupon.status !== 'active' || new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({ message: 'Coupon not active or expired' });
    }
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Usage limit reached' });
    }

    // if the coupon is backed by an NFT, verify ownership
    if (coupon.nft_token_id && coupon.nft_contract_address) {
      const owner = await nftContract.ownerOf(coupon.nft_token_id);
      if (owner.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({ message: 'Wallet does not own required NFT' });
      }
      // optional burn
      if (process.env.BURN_ON_REDEEM === 'true') {
        const tx = await nftContract.burnCoupon(coupon.nft_token_id);
        await tx.wait();
      }
    }

    // if we have an orderId we can record a redemption row (userId optional)
    if (orderId) {
      const fields = ['id', 'coupon_id', 'redeemed_at'];
      const placeholders = ['gen_random_uuid()', '$1', 'now()'];
      const params = [coupon.id];

      if (userId) {
        fields.push('user_id');
        placeholders.push(`$${params.length + 1}`);
        params.push(userId);
      }
      fields.push('order_id');
      placeholders.push(`$${params.length + 1}`);
      params.push(orderId);

      await pool.query(
        `INSERT INTO coupon_redemptions (${fields.join(', ')})
         VALUES (${placeholders.join(', ')})`,
        params
      );
    } else {
      // no order yet; just log for debugging and still increment usage_count
      console.log('redeem: no orderId provided, skipping coupon_redemptions insert');
    }

    await pool.query(
      'UPDATE coupons SET usage_count = COALESCE(usage_count,0) + 1 WHERE id = $1',
      [coupon.id]
    );

    return res.json({
      ok: true,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      message: 'Coupon redeemed'
    });
  } catch (error) {
    // log full error for debugging
    console.error('redeem error', error);
    return res.status(500).json({
      message: 'Failed to redeem coupon',
      error: error.message,
      stack: error.stack,
    });
  }
});

app.get('/api/admin/users', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const role = (req.query.role || 'all').toString();

  const where = ["role IN ('customer', 'driver', 'restaurant')"];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(full_name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }
  if (role !== 'all') {
    params.push(role);
    where.push(`role::text = $${params.length}`);
  }

  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.role::text AS role,
      u.status::text AS status,
      u.created_at,
      COALESCE(o.orders_count, 0) AS orders_count,
      COALESCE(dp.rating_avg, 0) AS driver_rating,
      COALESCE(dp.total_earnings, 0) AS driver_revenue
    FROM users u
    LEFT JOIN (
      SELECT customer_id, COUNT(*) AS orders_count
      FROM orders
      GROUP BY customer_id
    ) o ON o.customer_id = u.id
    LEFT JOIN driver_profiles dp ON dp.user_id = u.id
    WHERE ${where.join(' AND ')}
    ORDER BY u.created_at DESC
  `;

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      joinedDate: row.created_at,
      orders: Number(row.orders_count),
      rating: Number(row.driver_rating) || undefined,
      revenue: Number(row.driver_revenue) || undefined,
      status: row.status,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { name, email, phone, role = 'customer', status = 'active' } = req.body || {};
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email and phone are required' });
  }
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, 'temp_hash_change_me', $4::user_role, $5::user_status)
       RETURNING id`,
      [name, email, phone || null, role, status]
    );
    return res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

app.patch('/api/admin/users/:id/toggle-status', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users
       SET status = CASE
          WHEN status = 'active' THEN 'suspended'::user_status
          ELSE 'active'::user_status
        END,
        updated_at = now()
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
  }
});

app.patch('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status, vehicleType } = req.body || {};

  if (!name || !email || !phone || !role) {
    return res.status(400).json({ message: 'Name, email, phone, and role are required' });
  }
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE users
         SET full_name = $2,
             email = $3,
             phone = $4,
             role = $5::user_role,
             status = COALESCE($6::user_status, status),
             updated_at = now()
         WHERE id = $1
         RETURNING id`,
        [id, name.trim(), email.trim().toLowerCase(), phone.trim(), role, status || null]
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'User not found' });
      }

      if (role === 'driver' && vehicleType) {
        await client.query(
          `UPDATE driver_profiles
           SET vehicle_type = $2,
               updated_at = now()
           WHERE user_id = $1`,
          [id, vehicleType]
        );
      }

      await client.query('COMMIT');
      return res.json({ ok: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

app.get('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT
         u.id,
         u.full_name,
         u.email,
         u.phone,
         u.role::text AS role,
         u.status::text AS status,
         u.created_at,
         COALESCE(o.orders_count, 0) AS orders_count,
         COALESCE(dp.rating_avg, 0) AS driver_rating,
         COALESCE(dp.total_earnings, 0) AS driver_revenue,
         dp.vehicle_type
       FROM users u
       LEFT JOIN (
         SELECT customer_id, COUNT(*) AS orders_count
         FROM orders
         GROUP BY customer_id
       ) o ON o.customer_id = u.id
       LEFT JOIN driver_profiles dp ON dp.user_id = u.id
       WHERE u.id = $1
       LIMIT 1`,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    const row = rows[0];
    return res.json({
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      joinedDate: row.created_at,
      orders: Number(row.orders_count),
      rating: Number(row.driver_rating) || undefined,
      revenue: Number(row.driver_revenue) || undefined,
      vehicleType: row.vehicle_type || undefined,
      status: row.status,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

app.get('/api/admin/restaurants', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();
  const where = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(r.name ILIKE $${params.length} OR u.full_name ILIKE $${params.length})`);
  }
  if (status !== 'all') {
    params.push(status);
    where.push(`r.status::text = $${params.length}`);
  }

  const query = `
    SELECT
      r.id,
      r.name,
      u.full_name AS owner_name,
      r.email,
      r.phone,
      r.image_url,
      CONCAT(r.address_line1, ', ', r.city) AS address,
      r.rating_avg,
      r.status::text AS status,
      COALESCE(s.orders_count, 0) AS orders_count,
      COALESCE(s.revenue, 0) AS revenue
    FROM restaurants r
    JOIN users u ON u.id = r.owner_user_id
    LEFT JOIN (
      SELECT
        restaurant_id,
        COUNT(*) AS orders_count,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END), 0) AS revenue
      FROM orders
      GROUP BY restaurant_id
    ) s ON s.restaurant_id = r.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY r.created_at DESC
  `;
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => {
      const normalizedRow = normalizeRestaurantRecord(row);
      return {
      id: row.id,
      name: row.name,
      owner: row.owner_name,
      email: row.email || '',
      phone: row.phone || '',
      image: getRestaurantImage(row),
      address: `${normalizedRow.address_line1}, ${normalizedRow.city}`,
      orders: Number(row.orders_count),
      revenue: Number(row.revenue),
      rating: Number(row.rating_avg) || null,
      status: row.status,
      };
    }));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

app.post('/api/admin/restaurants', async (req, res) => {
  const {
    name,
    ownerName,
    email,
    phone,
    imageUrl,
    addressLine1,
    city = DEFAULT_ALEXANDRIA_RESTAURANT.city,
    state = DEFAULT_ALEXANDRIA_RESTAURANT.state,
    postalCode = DEFAULT_ALEXANDRIA_RESTAURANT.postalCode,
    status = 'pending',
  } = req.body || {};

  if (!name || !ownerName || !addressLine1 || !email || !phone) {
    return res.status(400).json({ message: 'Name, owner, email, phone and address are required' });
  }
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ownerResult = await client.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status)
       VALUES ($1, $2, $3, 'temp_hash_change_me', 'restaurant'::user_role, 'active'::user_status)
       RETURNING id`,
      [ownerName, email, phone || null]
    );
    const ownerId = ownerResult.rows[0].id;
    const restResult = await client.query(
      `INSERT INTO restaurants (
         owner_user_id, name, email, phone, image_url, address_line1, city, state, postal_code, country_code, status
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::restaurant_status)
       RETURNING id`,
      [
        ownerId,
        name,
        email || null,
        phone || null,
        imageUrl || null,
        addressLine1,
        city,
        state,
        postalCode,
        DEFAULT_ALEXANDRIA_RESTAURANT.countryCode,
        status,
      ]
    );
    await client.query('COMMIT');
    return res.status(201).json({ ok: true, id: restResult.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to create restaurant', error: error.message });
  } finally {
    client.release();
  }
});

app.patch('/api/admin/restaurants/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE restaurants SET status = 'active'::restaurant_status, updated_at = now() WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Restaurant not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to approve restaurant', error: error.message });
  }
});

app.patch('/api/admin/restaurants/:id/image', async (req, res) => {
  const { id } = req.params;
  const imageUrl = (req.body?.imageUrl || '').toString().trim();

  try {
    const result = await pool.query(
      `UPDATE restaurants
       SET image_url = $2,
           updated_at = now()
       WHERE id = $1
       RETURNING id`,
      [id, imageUrl || null]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update restaurant image', error: error.message });
  }
});

app.get('/api/admin/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT
         r.id,
         r.name,
         u.full_name AS owner_name,
         r.email,
         r.phone,
         r.image_url,
         r.address_line1,
         r.city,
         r.state,
         r.postal_code,
         r.status::text AS status
       FROM restaurants r
       JOIN users u ON u.id = r.owner_user_id
       WHERE r.id = $1
       LIMIT 1`,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const row = normalizeRestaurantRecord(rows[0]);
    return res.json({
      id: row.id,
      name: row.name,
      ownerName: row.owner_name,
      email: row.email || '',
      phone: row.phone || '',
      imageUrl: row.image_url || '',
      addressLine1: row.address_line1 || '',
      city: row.city || '',
      state: row.state || '',
      postalCode: row.postal_code || '',
      status: row.status,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch restaurant', error: error.message });
  }
});

app.patch('/api/admin/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    ownerName,
    email,
    phone,
    imageUrl,
    addressLine1,
    city,
    state,
    postalCode,
    status,
  } = req.body || {};

  if (!name || !ownerName || !email || !phone || !addressLine1) {
    return res.status(400).json({ message: 'Name, owner, email, phone and address are required' });
  }
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const restaurantResult = await client.query(
      `SELECT owner_user_id
       FROM restaurants
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    if (restaurantResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const ownerUserId = restaurantResult.rows[0].owner_user_id;

    await client.query(
      `UPDATE users
       SET full_name = $2,
           email = $3,
           phone = $4,
           updated_at = now()
       WHERE id = $1`,
      [ownerUserId, ownerName, email.trim().toLowerCase(), phone.trim()]
    );

    await client.query(
      `UPDATE restaurants
       SET name = $2,
           email = $3,
           phone = $4,
           image_url = $5,
           address_line1 = $6,
           city = $7,
           state = $8,
           postal_code = $9,
           status = $10::restaurant_status,
           updated_at = now()
       WHERE id = $1`,
      [
        id,
        name,
        email.trim().toLowerCase(),
        phone.trim(),
        imageUrl || null,
        addressLine1,
        city || 'New York',
        state || 'NY',
        postalCode || '10001',
        status || 'pending',
      ]
    );

    await client.query('COMMIT');
    return res.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to update restaurant', error: error.message });
  } finally {
    client.release();
  }
});

app.delete('/api/admin/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Restaurant not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete restaurant', error: error.message });
  }
});

app.get('/api/admin/drivers', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();
  const where = [];
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    where.push(`(u.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR COALESCE(u.phone, '') ILIKE $${params.length})`);
  }
  if (status !== 'all') {
    params.push(status);
    where.push(`dp.status::text = $${params.length}`);
  }
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      dp.vehicle_type,
      dp.vehicle_number,
      dp.joined_at,
      dp.total_deliveries,
      dp.rating_avg,
      dp.total_earnings,
      dp.status::text AS status,
      dp.availability::text AS availability,
      dp.current_location_text
    FROM driver_profiles dp
    JOIN users u ON u.id = dp.user_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY dp.joined_at DESC
  `;
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone || '',
      vehicleType: row.vehicle_type,
      vehicleNumber: row.vehicle_number,
      joinedDate: row.joined_at,
      deliveries: Number(row.total_deliveries),
      rating: Number(row.rating_avg),
      earnings: Number(row.total_earnings),
      status: row.status,
      currentLocation: row.current_location_text || undefined,
      availability: row.availability,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
  }
});

app.post('/api/admin/drivers', async (req, res) => {
  const {
    name,
    email,
    phone,
    vehicleType = 'Motorcycle',
    vehicleNumber,
    status = 'pending',
  } = req.body || {};

  if (!name || !email || !phone || !vehicleNumber) {
    return res.status(400).json({ message: 'Name, email, phone and vehicle number are required' });
  }
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status)
       VALUES ($1,$2,$3,'temp_hash_change_me','driver'::user_role,'active'::user_status)
       RETURNING id`,
      [name, email, phone || null]
    );
    const userId = userResult.rows[0].id;
    await client.query(
      `INSERT INTO driver_profiles (user_id, vehicle_type, vehicle_number, status, availability)
       VALUES ($1,$2,$3,$4::driver_status,'offline'::availability_status)`,
      [userId, vehicleType, vehicleNumber, status]
    );
    await client.query('COMMIT');
    return res.status(201).json({ ok: true, id: userId });
  } catch (error) {
    await client.query('ROLLBACK');
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to create driver', error: error.message });
  } finally {
    client.release();
  }
});

app.patch('/api/admin/drivers/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE driver_profiles
       SET status = 'active'::driver_status, availability = 'available'::availability_status, updated_at = now()
       WHERE user_id = $1
       RETURNING user_id`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Driver not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to approve driver', error: error.message });
  }
});

app.patch('/api/admin/drivers/:id/toggle-status', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE driver_profiles
       SET status = CASE WHEN status = 'active' THEN 'suspended'::driver_status ELSE 'active'::driver_status END,
           updated_at = now()
       WHERE user_id = $1
       RETURNING user_id`,
      [id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Driver not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle driver status', error: error.message });
  }
});

app.delete('/api/admin/drivers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND role = \'driver\'', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Driver not found' });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete driver', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const {
    customerId,
    customerEmail,
    items,
    paymentMethod,
    promoCode,
    deliveryLine1,
    deliveryCity,
    deliveryState,
    deliveryPostalCode,
    deliveryCountryCode,
    deliveryNotes,
  } = req.body || {};

  if (!customerId) {
    return res.status(400).json({ message: 'Customer is required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'At least one order item is required' });
  }

  const paymentMethodDb = toPaymentMethodDb(paymentMethod);
  if (!['card', 'cash', 'wallet', 'paypal', 'apple_pay'].includes(paymentMethodDb)) {
    return res.status(400).json({ message: 'Invalid payment method' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let resolvedCustomerId = customerId;
    let customerResult = await client.query(
      `SELECT id
       FROM users
       WHERE id = $1 AND role = 'customer'::user_role`,
      [customerId]
    );

    if (customerResult.rowCount === 0 && customerEmail) {
      customerResult = await client.query(
        `SELECT id
         FROM users
         WHERE LOWER(email) = LOWER($1) AND role = 'customer'::user_role
         LIMIT 1`,
        [customerEmail]
      );
      resolvedCustomerId = customerResult.rows[0]?.id || null;
    }

    if (customerResult.rowCount === 0 || !resolvedCustomerId) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Customer account not found. Please sign in as a customer and try again.' });
    }

    const normalizedItems = items
      .map((item) => ({
        menuItemId: item?.menuItemId || item?.id,
        quantity: Number(item?.quantity || 0),
      }))
      .filter((item) => item.menuItemId && item.quantity > 0);

    if (normalizedItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Order items are invalid' });
    }

    const menuItemIds = normalizedItems.map((item) => item.menuItemId);
    const menuItemsResult = await client.query(
      `SELECT id, restaurant_id, name, price
       FROM menu_items
       WHERE id = ANY($1::uuid[]) AND deleted_at IS NULL`,
      [menuItemIds]
    );

    if (menuItemsResult.rowCount !== normalizedItems.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'One or more menu items no longer exist' });
    }

    const menuItemsById = new Map(menuItemsResult.rows.map((row) => [row.id, row]));
    const restaurantIds = new Set(menuItemsResult.rows.map((row) => row.restaurant_id));

    if (restaurantIds.size !== 1) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'All order items must belong to the same restaurant' });
    }

    const restaurantId = menuItemsResult.rows[0].restaurant_id;
    let subtotal = 0;
    let itemCount = 0;
    const orderItems = normalizedItems.map((item) => {
      const menuItem = menuItemsById.get(item.menuItemId);
      const unitPrice = Number(menuItem.price);
      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      subtotal += lineTotal;
      itemCount += item.quantity;
      return {
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    subtotal = Number(subtotal.toFixed(2));
    const deliveryFee = 4.99;
    const serviceFee = 0;
    const discountAmount = 0;
    const taxAmount = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + deliveryFee + serviceFee + taxAmount - discountAmount).toFixed(2));
    const estimatedDeliveryAt = new Date(Date.now() + 35 * 60 * 1000);
    const orderId = crypto.randomUUID();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    let couponId = null;
    if (promoCode) {
      const couponResult = await client.query(
        `SELECT id
         FROM coupons
         WHERE LOWER(code) = LOWER($1)
         LIMIT 1`,
        [promoCode]
      );
      couponId = couponResult.rows[0]?.id || null;
    }

    await client.query(
      `INSERT INTO orders (
         id, order_number, customer_id, restaurant_id, status, payment_method, payment_status,
         subtotal, delivery_fee, service_fee, tax_amount, discount_amount, total_amount, item_count,
         promo_code, coupon_id, delivery_line1, delivery_city, delivery_state, delivery_postal_code,
         delivery_country_code, delivery_notes, placed_at, estimated_delivery_at
       )
       VALUES (
         $1, $2, $3, $4, 'pending'::order_status, $5::payment_method, $6::payment_status,
         $7, $8, $9, $10, $11, $12, $13,
         $14, $15, $16, $17, $18, $19,
         $20, $21, now(), $22
       )`,
      [
        orderId,
        orderNumber,
        resolvedCustomerId,
        restaurantId,
        paymentMethodDb,
        paymentMethodDb === 'card' ? 'authorized' : 'pending',
        subtotal,
        deliveryFee,
        serviceFee,
        taxAmount,
        discountAmount,
        totalAmount,
        itemCount,
        promoCode || null,
        couponId,
        deliveryLine1 || '123 Main Street, Apt 4B',
        deliveryCity || 'New York',
        deliveryState || 'NY',
        deliveryPostalCode || '10001',
        deliveryCountryCode || 'US',
        deliveryNotes || null,
        estimatedDeliveryAt,
      ]
    );

    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.menuItemId, item.itemName, item.unitPrice, item.quantity, item.lineTotal]
      );
    }

    await client.query(
      `INSERT INTO order_status_history (order_id, status, changed_by_user_id, note)
       VALUES ($1, 'pending'::order_status, $2, 'Order created from checkout')`,
      [orderId, resolvedCustomerId]
    );

    await client.query(
      `INSERT INTO payments (order_id, method, status, amount, currency, is_cash_collected)
       VALUES ($1, $2::payment_method, $3::payment_status, $4, 'USD', false)`,
      [orderId, paymentMethodDb, paymentMethodDb === 'card' ? 'authorized' : 'pending', totalAmount]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      id: orderId,
      orderNumber,
      restaurantId,
      total: totalAmount,
      estimatedDeliveryAt,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Failed to create order', error: error.message });
  } finally {
    client.release();
  }
});

app.get('/api/admin/orders', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();
  const where = [];
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    where.push(`(o.order_number ILIKE $${params.length} OR c.full_name ILIKE $${params.length} OR r.name ILIKE $${params.length})`);
  }
  if (status !== 'all') {
    const dbStatus = status === 'ready' ? 'ready_for_delivery' : status === 'delivering' ? 'out_for_delivery' : status;
    params.push(dbStatus);
    where.push(`o.status::text = $${params.length}`);
  }
  const query = `
    SELECT
      o.id,
      o.order_number,
      c.full_name AS customer_name,
      c.email AS customer_email,
      r.name AS restaurant_name,
      d.full_name AS driver_name,
      o.item_count,
      o.total_amount,
      o.status::text AS status,
      o.payment_method::text AS payment_method,
      CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
      o.placed_at,
      o.estimated_delivery_at
    FROM orders o
    JOIN users c ON c.id = o.customer_id
    JOIN restaurants r ON r.id = o.restaurant_id
    LEFT JOIN users d ON d.id = o.assigned_driver_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY o.placed_at DESC
  `;
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      customer: row.customer_name,
      customerEmail: row.customer_email,
      restaurant: row.restaurant_name,
      driver: row.driver_name,
      items: Number(row.item_count),
      total: Number(row.total_amount),
      status: toStatusView(row.status),
      paymentMethod: row.payment_method.replace('_', ' '),
      deliveryAddress: row.delivery_address,
      orderTime: row.placed_at,
      estimatedDelivery: row.estimated_delivery_at,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

app.get('/api/orders/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const orderResult = await pool.query(
      `SELECT
         o.id,
         o.order_number,
         o.customer_id,
         o.restaurant_id,
         o.status::text AS status,
         o.total_amount,
         o.item_count,
         o.placed_at,
         o.estimated_delivery_at,
         o.delivered_at,
         o.cancelled_at,
         CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
         o.delivery_city,
         o.delivery_notes,
         o.payment_method::text AS payment_method,
         r.name AS restaurant_name,
         d.full_name AS driver_name,
         d.phone AS driver_phone,
         dp.vehicle_type AS driver_vehicle_type
       FROM orders o
       JOIN restaurants r ON r.id = o.restaurant_id
       LEFT JOIN users d ON d.id = o.assigned_driver_id
       LEFT JOIN driver_profiles dp ON dp.user_id = o.assigned_driver_id
       WHERE o.order_number = $1
       LIMIT 1`,
      [orderNumber]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const historyResult = await pool.query(
      `SELECT status::text AS status, created_at
       FROM order_status_history
       WHERE order_id = $1
       ORDER BY created_at ASC`,
      [order.id]
    );

    return res.json({
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      restaurantId: order.restaurant_id,
      status: toStatusView(order.status),
      total: Number(order.total_amount),
      items: Number(order.item_count),
      orderTime: order.placed_at,
      estimatedDelivery: order.estimated_delivery_at,
      deliveredAt: order.delivered_at,
      cancelledAt: order.cancelled_at,
      deliveryAddress: order.delivery_address,
      deliveryCity: order.delivery_city,
      deliveryNotes: order.delivery_notes,
      paymentMethod: order.payment_method.replace('_', ' '),
      restaurant: order.restaurant_name,
      driver: order.driver_name,
      driverPhone: order.driver_phone,
      driverVehicleType: order.driver_vehicle_type,
      history: historyResult.rows.map((row) => ({
        status: toStatusView(row.status),
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch order tracking', error: error.message });
  }
});

app.get('/api/orders/:orderId/review', async (req, res) => {
  const { orderId } = req.params;
  const customerId = (req.query.customerId || '').toString();

  if (!customerId) {
    return res.status(400).json({ message: 'customerId is required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, food_rating, comment, created_at
       FROM reviews
       WHERE order_id = $1 AND customer_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [orderId, customerId]
    );

    if (!rows[0]) {
      return res.json({ review: null });
    }

    return res.json({
      review: {
        id: rows[0].id,
        rating: Number(rows[0].food_rating),
        comment: rows[0].comment || '',
        createdAt: rows[0].created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch review', error: error.message });
  }
});

app.post('/api/orders/:orderId/review', async (req, res) => {
  const { orderId } = req.params;
  const { customerId, rating, comment } = req.body || {};
  const normalizedRating = Number(rating);

  if (!customerId || Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
    return res.status(400).json({ message: 'customerId and rating (1-5) are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `SELECT id, customer_id, restaurant_id, status::text AS status
       FROM orders
       WHERE id = $1
       LIMIT 1`,
      [orderId]
    );

    if (orderResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];
    if (order.customer_id !== customerId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'You can only review your own order' });
    }
    if (order.status !== 'delivered') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'You can review the order after it is delivered' });
    }

    const existingReviewResult = await client.query(
      `SELECT id
       FROM reviews
       WHERE order_id = $1 AND customer_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [orderId, customerId]
    );

    if (existingReviewResult.rowCount > 0) {
      await client.query(
        `UPDATE reviews
         SET food_rating = $2,
             comment = $3
         WHERE id = $1`,
        [existingReviewResult.rows[0].id, normalizedRating, comment?.trim() || null]
      );
    } else {
      await client.query(
        `INSERT INTO reviews (id, order_id, customer_id, restaurant_id, food_rating, comment)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [crypto.randomUUID(), orderId, customerId, order.restaurant_id, normalizedRating, comment?.trim() || null]
      );
    }

    const ratingStatsResult = await client.query(
      `SELECT
         COALESCE(AVG(food_rating), 0) AS rating_avg,
         COUNT(*) FILTER (WHERE food_rating IS NOT NULL) AS rating_count
       FROM reviews
       WHERE restaurant_id = $1`,
      [order.restaurant_id]
    );

    await client.query(
      `UPDATE restaurants
       SET rating_avg = $2,
           rating_count = $3,
           updated_at = now()
       WHERE id = $1`,
      [
        order.restaurant_id,
        Number(ratingStatsResult.rows[0].rating_avg || 0),
        Number(ratingStatsResult.rows[0].rating_count || 0),
      ]
    );

    await client.query('COMMIT');
    return res.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Failed to save review', error: error.message });
  } finally {
    client.release();
  }
});

app.get('/api/restaurants/:restaurantId/reviews', async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT
         rv.id,
         rv.food_rating,
         rv.comment,
         rv.created_at,
         u.full_name AS customer_name
       FROM reviews rv
       JOIN users u ON u.id = rv.customer_id
       WHERE rv.restaurant_id = $1
       ORDER BY rv.created_at DESC
       LIMIT 12`,
      [restaurantId]
    );

    return res.json(
      rows.map((row) => ({
        id: row.id,
        customer: row.customer_name,
        rating: Number(row.food_rating),
        comment: row.comment || '',
        createdAt: row.created_at,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch restaurant reviews', error: error.message });
  }
});

app.get('/api/drivers/available', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         u.id,
         u.full_name,
         u.email,
         u.phone,
         dp.availability::text AS availability,
         dp.vehicle_type,
         dp.vehicle_number
       FROM users u
       JOIN driver_profiles dp ON dp.user_id = u.id
       WHERE u.role = 'driver'::user_role
         AND u.status = 'active'::user_status
       ORDER BY
         CASE dp.availability
           WHEN 'available'::availability_status THEN 0
           WHEN 'offline'::availability_status THEN 1
           ELSE 2
         END,
         u.full_name ASC`
    );

    return res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.full_name,
        email: row.email,
        phone: row.phone,
        availability: row.availability,
        vehicleType: row.vehicle_type,
        vehicleNumber: row.vehicle_number,
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch drivers', error: error.message });
  }
});

app.get('/api/restaurants/:restaurantId/orders', async (req, res) => {
  const { restaurantId } = req.params;
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();
  const where = ['o.restaurant_id = $1'];
  const params = [restaurantId];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(o.order_number ILIKE $${params.length} OR c.full_name ILIKE $${params.length})`);
  }

  if (status !== 'all') {
    if (status === 'history') {
      where.push(`o.status::text IN ('delivered', 'cancelled')`);
    } else if (status === 'active') {
      where.push(`o.status::text NOT IN ('delivered', 'cancelled')`);
    } else {
      const dbStatus = status === 'ready' ? 'ready_for_delivery' : status === 'delivering' ? 'out_for_delivery' : status;
      params.push(dbStatus);
      where.push(`o.status::text = $${params.length}`);
    }
  }

  const query = `
    SELECT
      o.id,
      o.order_number,
      c.full_name AS customer_name,
      c.phone AS customer_phone,
      o.delivery_notes,
      d.full_name AS driver_name,
      pending_driver.full_name AS pending_driver_name,
      pending_assignment.id AS pending_assignment_id,
      o.item_count,
      o.total_amount,
      o.status::text AS status,
      o.payment_method::text AS payment_method,
      CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
      o.placed_at,
      o.estimated_delivery_at
    FROM orders o
    JOIN users c ON c.id = o.customer_id
    LEFT JOIN users d ON d.id = o.assigned_driver_id
    LEFT JOIN LATERAL (
      SELECT da.id, da.driver_user_id
      FROM driver_assignments da
      WHERE da.order_id = o.id
        AND da.status = 'pending'::driver_assignment_status
        AND (da.expires_at IS NULL OR da.expires_at > now())
      ORDER BY da.requested_at DESC
      LIMIT 1
    ) pending_assignment ON true
    LEFT JOIN users pending_driver ON pending_driver.id = pending_assignment.driver_user_id
    WHERE ${where.join(' AND ')}
    ORDER BY o.placed_at DESC
  `;

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      customer: row.customer_name,
      customerPhone: row.customer_phone || extractPhoneFromDeliveryNotes(row.delivery_notes),
      driver: row.driver_name,
      pendingDriver: row.pending_driver_name,
      hasPendingDriverRequest: Boolean(row.pending_assignment_id),
      items: Number(row.item_count),
      total: Number(row.total_amount),
      status: toStatusView(row.status),
      paymentMethod: row.payment_method.replace('_', ' '),
      deliveryAddress: row.delivery_address,
      orderTime: row.placed_at,
      estimatedDelivery: row.estimated_delivery_at,
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurant orders', error: error.message });
  }
});

app.get('/api/restaurants/:restaurantId/dashboard', async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const [restaurantResult, statsResult, trendResult, weeklyResult, activeOrdersResult] = await Promise.all([
      pool.query(
        `SELECT id, name, email, phone, city, status::text AS status
         FROM restaurants
         WHERE id = $1
         LIMIT 1`,
        [restaurantId]
      ),
      pool.query(
        `SELECT
           COUNT(*) AS total_orders,
           COUNT(*) FILTER (WHERE status::text NOT IN ('delivered', 'cancelled')) AS active_orders,
           COUNT(*) FILTER (WHERE status::text = 'pending') AS pending_orders,
           COUNT(*) FILTER (WHERE status::text = 'preparing') AS preparing_orders,
           COUNT(*) FILTER (WHERE status::text IN ('ready_for_delivery', 'out_for_delivery')) AS in_delivery_orders,
           COALESCE(SUM(CASE WHEN status::text = 'delivered' THEN total_amount ELSE 0 END), 0) AS total_revenue,
           COALESCE(AVG(total_amount), 0) AS average_order_value
         FROM orders
         WHERE restaurant_id = $1`,
        [restaurantId]
      ),
      pool.query(
        `SELECT
           COALESCE(SUM(CASE
             WHEN placed_at >= date_trunc('day', now()) - interval '6 days'
              AND status::text = 'delivered'
             THEN total_amount ELSE 0 END), 0) AS current_revenue,
           COALESCE(SUM(CASE
             WHEN placed_at >= date_trunc('day', now()) - interval '13 days'
              AND placed_at < date_trunc('day', now()) - interval '6 days'
              AND status::text = 'delivered'
             THEN total_amount ELSE 0 END), 0) AS previous_revenue,
           COUNT(*) FILTER (
             WHERE placed_at >= date_trunc('day', now()) - interval '6 days'
           ) AS current_orders,
           COUNT(*) FILTER (
             WHERE placed_at >= date_trunc('day', now()) - interval '13 days'
               AND placed_at < date_trunc('day', now()) - interval '6 days'
           ) AS previous_orders
         FROM orders
         WHERE restaurant_id = $1`,
        [restaurantId]
      ),
      pool.query(
        `SELECT
           TO_CHAR(days.day_value, 'Dy') AS day_label,
           COALESCE(stats.orders_count, 0) AS orders_count,
           COALESCE(stats.revenue_total, 0) AS revenue_total
         FROM generate_series(
           date_trunc('day', now()) - interval '6 days',
           date_trunc('day', now()),
           interval '1 day'
         ) AS days(day_value)
         LEFT JOIN (
           SELECT
             date_trunc('day', placed_at) AS order_day,
             COUNT(*) AS orders_count,
             COALESCE(SUM(CASE WHEN status::text = 'delivered' THEN total_amount ELSE 0 END), 0) AS revenue_total
           FROM orders
           WHERE restaurant_id = $1
             AND placed_at >= date_trunc('day', now()) - interval '6 days'
           GROUP BY date_trunc('day', placed_at)
         ) stats ON stats.order_day = days.day_value
         ORDER BY days.day_value`,
        [restaurantId]
      ),
      pool.query(
        `SELECT
           o.id,
           o.order_number,
           c.full_name AS customer_name,
           o.item_count,
           o.total_amount,
           o.status::text AS status,
           o.placed_at
         FROM orders o
         JOIN users c ON c.id = o.customer_id
         WHERE o.restaurant_id = $1
           AND o.status::text NOT IN ('delivered', 'cancelled')
         ORDER BY o.placed_at DESC
         LIMIT 5`,
        [restaurantId]
      ),
    ]);

    if (restaurantResult.rowCount === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = restaurantResult.rows[0];
    const stats = statsResult.rows[0];
    const trend = trendResult.rows[0];
    const trendPercent = (currentValue, previousValue) => {
      const current = Number(currentValue || 0);
      const previous = Number(previousValue || 0);
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    return res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        city: restaurant.city,
        status: restaurant.status,
      },
      stats: {
        totalRevenue: Number(stats.total_revenue),
        totalOrders: Number(stats.total_orders),
        activeOrders: Number(stats.active_orders),
        pendingOrders: Number(stats.pending_orders),
        preparingOrders: Number(stats.preparing_orders),
        inDeliveryOrders: Number(stats.in_delivery_orders),
        averageOrderValue: Number(stats.average_order_value),
        revenueTrend: trendPercent(trend.current_revenue, trend.previous_revenue),
        ordersTrend: trendPercent(trend.current_orders, trend.previous_orders),
      },
      charts: {
        revenue: weeklyResult.rows.map((row) => ({
          day: row.day_label.trim(),
          value: Number(row.revenue_total),
        })),
        orders: weeklyResult.rows.map((row) => ({
          day: row.day_label.trim(),
          orders: Number(row.orders_count),
        })),
      },
      activeOrders: activeOrdersResult.rows.map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        customer: row.customer_name,
        items: Number(row.item_count),
        amount: Number(row.total_amount),
        status: toStatusView(row.status),
        placedAt: row.placed_at,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load restaurant dashboard', error: error.message });
  }
});

app.post('/api/restaurants/:restaurantId/orders/:orderId/assign-driver', async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const driverId = (req.body?.driverId || '').toString();

  if (!driverId) {
    return res.status(400).json({ message: 'Driver is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `SELECT id, order_number
       FROM orders
       WHERE id = $1 AND restaurant_id = $2`,
      [orderId, restaurantId]
    );
    if (orderResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found for this restaurant' });
    }

    const driverResult = await client.query(
      `SELECT u.id, u.full_name
       FROM users u
       JOIN driver_profiles dp ON dp.user_id = u.id
       WHERE u.id = $1
         AND u.role = 'driver'::user_role
         AND u.status = 'active'::user_status`,
      [driverId]
    );
    if (driverResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Driver not found' });
    }

    await client.query(
      `UPDATE driver_assignments
       SET status = 'cancelled'::driver_assignment_status,
           responded_at = now()
       WHERE order_id = $1 AND status = 'pending'::driver_assignment_status`,
      [orderId]
    );

    const assignmentResult = await client.query(
      `INSERT INTO driver_assignments (order_id, driver_user_id, status, requested_at, expires_at)
       VALUES ($1, $2, 'pending'::driver_assignment_status, now(), now() + interval '30 seconds')
       RETURNING id`,
      [orderId, driverId]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      ok: true,
      assignmentId: assignmentResult.rows[0].id,
      driverName: driverResult.rows[0].full_name,
      orderNumber: orderResult.rows[0].order_number,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Failed to assign driver', error: error.message });
  } finally {
    client.release();
  }
});

app.patch('/api/restaurants/:restaurantId/orders/:orderId/status', async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const requestedStatus = (req.body?.status || '').toString();
  const dbStatus = toDbOrderStatus(requestedStatus);
  const allowedStatuses = ['pending', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled'];

  if (!allowedStatuses.includes(dbStatus)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE orders
       SET status = $1::order_status
       WHERE id = $2 AND restaurant_id = $3
       RETURNING id, order_number, status::text AS status`,
      [dbStatus, orderId, restaurantId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'Order not found for this restaurant' });
    }

    try {
      await pool.query(
        `INSERT INTO order_status_history (order_id, status, note)
         VALUES ($1, $2::order_status, $3)`,
        [orderId, dbStatus, `Status updated by restaurant to ${requestedStatus}`]
      );
    } catch (historyError) {
      console.error('order status history insert failed', historyError);
    }

    return res.json({
      ok: true,
      id: updateResult.rows[0].id,
      orderNumber: updateResult.rows[0].order_number,
      status: toStatusView(updateResult.rows[0].status),
    });
  } catch (error) {
    console.error('order status update failed', error);
    return res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

app.get('/api/driver/dashboard', async (req, res) => {
  const driverId = (req.query.driverId || '').toString();
  if (!driverId) {
    return res.status(400).json({ message: 'driverId is required' });
  }

  try {
    const [requestResult, activeResult, summaryResult] = await Promise.all([
      pool.query(
      `SELECT
         da.id,
         da.expires_at,
         o.id AS order_id,
         o.order_number,
         o.item_count,
         o.total_amount,
         o.delivery_notes,
         o.payment_method::text AS payment_method,
         CONCAT(r.address_line1, ', ', r.city) AS pickup_address,
         CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
         r.name AS restaurant_name,
         r.phone AS restaurant_phone,
         c.full_name AS customer_name,
         c.phone AS customer_phone
       FROM driver_assignments da
       JOIN orders o ON o.id = da.order_id
       JOIN restaurants r ON r.id = o.restaurant_id
       JOIN users c ON c.id = o.customer_id
       WHERE da.driver_user_id = $1
         AND da.status = 'pending'::driver_assignment_status
         AND (da.expires_at IS NULL OR da.expires_at > now())
       ORDER BY da.requested_at DESC
       LIMIT 1`,
      [driverId]
      ),
      pool.query(
      `SELECT
         da.id AS assignment_id,
         o.id AS order_id,
         o.order_number,
         o.item_count,
         o.total_amount,
         o.delivery_notes,
         o.status::text AS order_status,
         o.payment_method::text AS payment_method,
         CONCAT(r.address_line1, ', ', r.city) AS pickup_address,
         CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
         r.name AS restaurant_name,
         r.phone AS restaurant_phone,
         c.full_name AS customer_name,
         c.phone AS customer_phone
       FROM driver_assignments da
       JOIN orders o ON o.id = da.order_id
       JOIN restaurants r ON r.id = o.restaurant_id
       JOIN users c ON c.id = o.customer_id
       WHERE da.driver_user_id = $1
         AND da.status = 'accepted'::driver_assignment_status
         AND o.status::text NOT IN ('delivered', 'cancelled')
       ORDER BY o.placed_at DESC`,
      [driverId]
      ),
      pool.query(
      `SELECT
         COUNT(*) FILTER (
           WHERE da.status = 'pending'::driver_assignment_status
             AND (da.expires_at IS NULL OR da.expires_at > now())
         ) AS pending_requests,
         COUNT(*) FILTER (
           WHERE da.status = 'accepted'::driver_assignment_status
             AND o.status::text NOT IN ('delivered', 'cancelled')
         ) AS active_deliveries,
         COALESCE(SUM(
           CASE
             WHEN da.status = 'accepted'::driver_assignment_status
               AND (
                 o.status::text NOT IN ('delivered', 'cancelled')
                 OR (
                   o.status::text = 'delivered'
                   AND o.delivered_at >= date_trunc('day', now())
                 )
               )
             THEN ROUND((o.total_amount * 0.13)::numeric, 2)
             ELSE 0
           END
         ), 0) AS current_earnings
       FROM driver_assignments da
       JOIN orders o ON o.id = da.order_id
       WHERE da.driver_user_id = $1`,
      [driverId]
      ),
    ]);

    const requestRow = requestResult.rows[0];
    return res.json({
      request: requestRow
        ? {
            assignmentId: requestRow.id,
            orderId: requestRow.order_id,
            orderNumber: requestRow.order_number,
            restaurant: requestRow.restaurant_name,
            restaurantPhone: requestRow.restaurant_phone,
            customer: requestRow.customer_name,
            customerPhone: requestRow.customer_phone || extractPhoneFromDeliveryNotes(requestRow.delivery_notes),
            pickup: normalizeRestaurantAddress(requestRow.pickup_address),
            delivery: requestRow.delivery_address,
            items: Number(requestRow.item_count),
            total: Number(requestRow.total_amount),
            paymentMethod: requestRow.payment_method,
            earnings: Number((Number(requestRow.total_amount) * 0.13).toFixed(2)),
            timeout: Math.max(
              0,
              Math.floor((new Date(requestRow.expires_at).getTime() - Date.now()) / 1000)
            ),
          }
        : null,
      summary: {
        pendingRequests: Number(summaryResult.rows[0]?.pending_requests || 0),
        activeDeliveries: Number(summaryResult.rows[0]?.active_deliveries || 0),
        currentEarnings: Number(summaryResult.rows[0]?.current_earnings || 0),
      },
      activeDeliveries: activeResult.rows.map((row) => ({
        assignmentId: row.assignment_id,
        orderId: row.order_id,
        orderNumber: row.order_number,
        restaurant: row.restaurant_name,
        restaurantPhone: row.restaurant_phone,
        customer: row.customer_name,
        customerPhone: row.customer_phone || extractPhoneFromDeliveryNotes(row.delivery_notes),
        pickup: normalizeRestaurantAddress(row.pickup_address),
        delivery: row.delivery_address,
        items: Number(row.item_count),
        total: Number(row.total_amount),
        paymentMethod: row.payment_method,
        earnings: Number((Number(row.total_amount) * 0.13).toFixed(2)),
        status: toStatusView(row.order_status),
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load driver dashboard', error: error.message });
  }
});

app.patch('/api/driver/assignments/:assignmentId/respond', async (req, res) => {
  const { assignmentId } = req.params;
  const decision = (req.body?.decision || '').toString();
  const allowed = ['accepted', 'rejected'];
  if (!allowed.includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const assignmentResult = await client.query(
      `SELECT id, order_id, driver_user_id
       FROM driver_assignments
       WHERE id = $1 AND status = 'pending'::driver_assignment_status`,
      [assignmentId]
    );
    if (assignmentResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Assignment request not found or expired' });
    }

    const assignment = assignmentResult.rows[0];
    await client.query(
      `UPDATE driver_assignments
       SET status = $1::driver_assignment_status,
           responded_at = now()
       WHERE id = $2`,
      [decision, assignmentId]
    );

    if (decision === 'accepted') {
      await client.query(
        `UPDATE orders
         SET assigned_driver_id = $1,
             status = 'out_for_delivery'::order_status
         WHERE id = $2`,
        [assignment.driver_user_id, assignment.order_id]
      );

      await client.query(
        `UPDATE driver_profiles
         SET availability = 'busy'::availability_status
         WHERE user_id = $1`,
        [assignment.driver_user_id]
      );

      await client.query(
        `UPDATE driver_assignments
         SET status = 'cancelled'::driver_assignment_status,
             responded_at = now()
         WHERE order_id = $1
           AND id <> $2
           AND status = 'pending'::driver_assignment_status`,
        [assignment.order_id, assignmentId]
      );

      try {
        await client.query(
          `INSERT INTO order_status_history (order_id, status, note)
           VALUES ($1, 'out_for_delivery'::order_status, $2)`,
          [assignment.order_id, 'Driver accepted the delivery request']
        );
      } catch (historyError) {
        console.error('driver accept order status history insert failed', historyError);
      }
    }

    await client.query('COMMIT');
    return res.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Failed to respond to request', error: error.message });
  } finally {
    client.release();
  }
});

app.patch('/api/driver/orders/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  const driverId = (req.body?.driverId || '').toString();
  const nextStatus = (req.body?.status || '').toString();
  const allowed = ['delivered'];
  if (!driverId || !allowed.includes(nextStatus)) {
    return res.status(400).json({ message: 'Invalid driver status update' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `SELECT id
       FROM orders
       WHERE id = $1 AND assigned_driver_id = $2`,
      [orderId, driverId]
    );
    if (orderResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found for this driver' });
    }

    await client.query(
      `UPDATE orders
       SET status = 'delivered'::order_status,
           delivered_at = now()
       WHERE id = $1`,
      [orderId]
    );

    await client.query(
      `UPDATE driver_profiles
       SET availability = 'available'::availability_status
       WHERE user_id = $1`,
      [driverId]
    );

    try {
      await client.query(
        `INSERT INTO order_status_history (order_id, status, note)
         VALUES ($1, 'delivered'::order_status, $2)`,
        [orderId, 'Order marked as delivered by driver']
      );
    } catch (historyError) {
      console.error('driver delivered order status history insert failed', historyError);
    }

    await client.query('COMMIT');
    return res.json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Failed to update delivery status', error: error.message });
  } finally {
    client.release();
  }
});

app.get('/api/driver/history', async (req, res) => {
  const driverId = (req.query.driverId || '').toString();
  if (!driverId) {
    return res.status(400).json({ message: 'driverId is required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         da.id AS assignment_id,
         da.status::text AS assignment_status,
         COALESCE(da.responded_at, da.requested_at) AS activity_time,
         o.order_number,
         o.total_amount,
         o.delivery_notes,
         o.status::text AS order_status,
         CONCAT(r.address_line1, ', ', r.city) AS pickup_address,
         CONCAT(o.delivery_line1, ', ', o.delivery_city) AS delivery_address,
         r.name AS restaurant_name,
         r.phone AS restaurant_phone,
         c.full_name AS customer_name,
         c.phone AS customer_phone
       FROM driver_assignments da
       JOIN orders o ON o.id = da.order_id
       JOIN restaurants r ON r.id = o.restaurant_id
       JOIN users c ON c.id = o.customer_id
       WHERE da.driver_user_id = $1
         AND da.status::text IN ('accepted', 'rejected')
       ORDER BY COALESCE(da.responded_at, da.requested_at) DESC`,
      [driverId]
    );

    return res.json(
      rows.map((row) => ({
        id: row.assignment_id,
        orderNumber: row.order_number,
        date: row.activity_time,
        restaurant: row.restaurant_name,
        restaurantPhone: row.restaurant_phone,
        customer: row.customer_name,
        customerPhone: row.customer_phone || extractPhoneFromDeliveryNotes(row.delivery_notes),
        pickup: normalizeRestaurantAddress(row.pickup_address),
        delivery: row.delivery_address,
        earnings: row.assignment_status === 'accepted'
          ? Number((Number(row.total_amount) * 0.13).toFixed(2))
          : 0,
        status:
          row.assignment_status === 'rejected'
            ? 'Rejected'
            : row.order_status === 'delivered'
              ? 'Completed'
              : 'In Progress',
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load driver history', error: error.message });
  }
});

app.get('/api/admin/support', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const status = (req.query.status || 'all').toString();
  const priority = (req.query.priority || 'all').toString();
  const where = [];
  const params = [];
  if (search) {
    params.push(`%${search}%`);
    where.push(`(t.ticket_number ILIKE $${params.length} OR t.subject ILIKE $${params.length} OR c.full_name ILIKE $${params.length})`);
  }
  if (status !== 'all') {
    const dbStatus = status === 'in-progress' ? 'in_progress' : status;
    params.push(dbStatus);
    where.push(`t.status::text = $${params.length}`);
  }
  if (priority !== 'all') {
    params.push(priority);
    where.push(`t.priority::text = $${params.length}`);
  }
  const query = `
    SELECT
      t.id,
      t.ticket_number,
      t.subject,
      c.full_name AS customer_name,
      c.email AS customer_email,
      t.category::text AS category,
      t.priority::text AS priority,
      t.status::text AS status,
      t.created_at,
      t.updated_at,
      a.full_name AS assigned_to,
      COALESCE(m.messages, 0) AS messages
    FROM support_tickets t
    JOIN users c ON c.id = t.customer_id
    LEFT JOIN users a ON a.id = t.assigned_to_user_id
    LEFT JOIN (
      SELECT ticket_id, COUNT(*) AS messages
      FROM support_ticket_messages
      GROUP BY ticket_id
    ) m ON m.ticket_id = t.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY t.created_at DESC
  `;
  try {
    const { rows } = await pool.query(query, params);
    res.json(rows.map((row) => ({
      id: row.id,
      ticketNumber: row.ticket_number,
      subject: row.subject,
      customer: row.customer_name,
      customerEmail: row.customer_email,
      category: row.category.replace('_', '-'),
      priority: row.priority,
      status: row.status.replace('_', '-'),
      createdAt: row.created_at,
      lastUpdate: row.updated_at,
      assignedTo: row.assigned_to || undefined,
      messages: Number(row.messages),
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch support tickets', error: error.message });
  }
});

// =====================
// Restaurant Menu Items
// =====================

// GET all menu items for a restaurant
app.get('/api/restaurants/:restaurantId/menu/items', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.is_available,
        mi.rating_avg,
        mi.rating_count,
        mi.category_id,
        mc.name AS category_name,
        mi.created_at,
        mi.updated_at
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mc.id = mi.category_id
      WHERE mi.restaurant_id = $1 AND mi.deleted_at IS NULL
      ORDER BY mi.created_at DESC
    `, [restaurantId]);
    
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      image: row.image_url,
      available: row.is_available,
      rating: parseFloat(row.rating_avg),
      ratingCount: row.rating_count,
      categoryId: row.category_id,
      category: row.category_name || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
});

// POST - Add new menu item
app.post('/api/restaurants/:restaurantId/menu/items', async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, price, image, categoryId, available } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO menu_items (restaurant_id, name, description, price, image_url, category_id, is_available)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        rating_avg,
        rating_count,
        category_id,
        created_at,
        updated_at
    `, [restaurantId, name, description || null, price, image || null, categoryId || null, available !== false]);

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      image: row.image_url,
      available: row.is_available,
      rating: parseFloat(row.rating_avg),
      ratingCount: row.rating_count,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add menu item', error: error.message });
  }
});

// PUT - Update menu item
app.put('/api/restaurants/:restaurantId/menu/items/:itemId', async (req, res) => {
  const { restaurantId, itemId } = req.params;
  const { name, description, price, image, categoryId, available } = req.body;

  try {
    const updateFields = [];
    const params = [restaurantId, itemId];
    let paramCount = 3;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      params.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      params.push(description || null);
      paramCount++;
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramCount}`);
      params.push(price);
      paramCount++;
    }
    if (image !== undefined) {
      updateFields.push(`image_url = $${paramCount}`);
      params.push(image || null);
      paramCount++;
    }
    if (categoryId !== undefined) {
      updateFields.push(`category_id = $${paramCount}`);
      params.push(categoryId || null);
      paramCount++;
    }
    if (available !== undefined) {
      updateFields.push(`is_available = $${paramCount}`);
      params.push(available);
      paramCount++;
    }

    updateFields.push(`updated_at = NOW()`);

    const result = await pool.query(`
      UPDATE menu_items
      SET ${updateFields.join(', ')}
      WHERE id = $2 AND restaurant_id = $1 AND deleted_at IS NULL
      RETURNING
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        rating_avg,
        rating_count,
        category_id,
        created_at,
        updated_at
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      image: row.image_url,
      available: row.is_available,
      rating: parseFloat(row.rating_avg),
      ratingCount: row.rating_count,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
});

// DELETE - Remove menu item (soft delete)
app.delete('/api/restaurants/:restaurantId/menu/items/:itemId', async (req, res) => {
  const { restaurantId, itemId } = req.params;

  try {
    const result = await pool.query(`
      UPDATE menu_items
      SET deleted_at = NOW()
      WHERE id = $1 AND restaurant_id = $2 AND deleted_at IS NULL
      RETURNING id
    `, [itemId, restaurantId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
});

// PUBLIC ENDPOINTS

// GET all restaurants (for customers)
app.get('/api/restaurants', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.name,
        r.email,
        r.phone,
        r.image_url,
        r.address_line1,
        r.city,
        r.rating_avg as rating,
        r.rating_count,
        COUNT(DISTINCT m.id) as menu_items_count
      FROM restaurants r
      LEFT JOIN menu_items m ON m.restaurant_id = r.id
      WHERE r.status = 'active'::restaurant_status
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      image: getRestaurantImage(row),
      address: `${row.address_line1}, ${row.city}`,
      rating: Number(row.rating) || 0,
      ratingCount: Number(row.rating_count) || 0,
      menuItemsCount: Number(row.menu_items_count),
    })));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch restaurants', error: error.message });
  }
});

// GET user by email and role (for sign-in)
app.post('/api/auth/user', async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required' });
  }
  try {
    const user = await fetchUserByEmailAndRole(email.trim(), role);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(toAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// POST /api/auth/signin - Sign in user
app.post('/api/auth/signin', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (role === 'admin' && normalizedEmail !== ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Admin login is allowed for one account only' });
  }

  try {
    const user = role === 'admin'
      ? await ensureAdminUserExists()
      : await fetchUserByEmailAndRole(normalizedEmail, role);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordValid =
      role === 'admin'
        ? password === ADMIN_PASSWORD
        : await verifyPassword(password, user.password_hash, user.role);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login_at = now() WHERE id = $1', [user.id]);

    const payload = toAuthPayload(user);

    if (ENABLE_2FA) {
      // Generate a 6-digit one-time code for 2FA (for demo/testing purposes only)
      const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
      const twoFAKey = String(user.id);
      twoFACodes.set(twoFAKey, twoFACode);
      console.log(`✅ 2FA code for user ${user.email} (id=${user.id}): ${twoFACode}`);

      return res.json({
        ...payload,
        twoFactorRequired: true,
        userId: user.id,
      });
    }

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: 'Failed to sign in', error: error.message });
  }
});

// POST /api/auth/verify-2fa - Verify 2FA code
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({ message: 'userId and code are required' });
  }

  const twoFAKey = String(userId);
  const expected = twoFACodes.get(twoFAKey);
  if (!expected) {
    return res.status(400).json({ message: 'No 2FA code found for this user. Please sign in again.' });
  }

  if (expected !== code.toString().trim()) {
    return res.status(401).json({ message: 'Invalid 2FA code' });
  }

  twoFACodes.delete(twoFAKey);

  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(toAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify 2FA', error: error.message });
  }
});

// POST /api/auth/signup - Register new user
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password, and role are required' });
  }

  if (role === 'admin' || role === 'support') {
    return res.status(403).json({ message: 'Admin/support accounts cannot be created from sign up' });
  }
  
  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }
  
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ message: 'Phone number format is invalid' });
  }

  const passwordErrors = getPasswordValidationErrors(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: `Password must include ${passwordErrors.join(', ')}` });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  
  try {
    const createdUser = await createUserWithRole({
      name,
      email: normalizedEmail,
      phone: phone || null,
      passwordHash,
      role,
    });
    res.status(201).json(toAuthPayload(createdUser));
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Failed to sign up', error: error.message });
  }
});

app.post('/api/auth/forgot-password/request-otp', async (req, res) => {
  const { email, role } = req.body || {};

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required' });
  }

  if (role === 'admin' || role === 'support') {
    return res.status(403).json({ message: 'Password reset is not available for this account type here' });
  }

  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await fetchUserByEmailAndRole(normalizedEmail, role);
    if (!existingUser) {
      return res.status(404).json({ message: 'No account found for this email and role' });
    }

    const otp = issuePasswordResetOtp({
      email: normalizedEmail,
      role,
      userId: existingUser.id,
    });

    console.log(`✅ Password reset OTP for ${normalizedEmail} (${role}): ${otp}`);

    return res.json({ message: 'OTP sent successfully. Check the server terminal.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate OTP', error: error.message });
  }
});

app.post('/api/auth/forgot-password/verify-otp', async (req, res) => {
  const { email, role, otp } = req.body || {};

  if (!email || !role || !otp) {
    return res.status(400).json({ message: 'Email, role, and OTP are required' });
  }

  if (role === 'admin' || role === 'support') {
    return res.status(403).json({ message: 'Password reset is not available for this account type here' });
  }

  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const otpCheck = consumePasswordResetOtp({ email: normalizedEmail, role, otp });
  if (!otpCheck.ok) {
    return res.status(400).json({ message: otpCheck.message });
  }

  return res.json({ message: 'OTP verified successfully' });
});

app.post('/api/auth/forgot-password/reset-password', async (req, res) => {
  const { email, role, newPassword } = req.body || {};

  if (!email || !role || !newPassword) {
    return res.status(400).json({ message: 'Email, role, and new password are required' });
  }

  if (role === 'admin' || role === 'support') {
    return res.status(403).json({ message: 'Password reset is not available for this account type here' });
  }

  if (!isValidGmail(email)) {
    return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
  }

  const passwordErrors = getPasswordValidationErrors(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: `Password must include ${passwordErrors.join(', ')}` });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const resetKey = createPasswordResetKey(normalizedEmail, role);
  const resetRecord = passwordResetOtps.get(resetKey);

  if (!resetRecord || resetRecord.expiresAt < Date.now() || resetRecord.verified !== true) {
    return res.status(400).json({ message: 'Verify the OTP first before changing the password' });
  }

  try {
    const passwordHash = await hashPassword(newPassword);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, resetRecord.userId]
    );
    passwordResetOtps.delete(resetKey);

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
});

app.post('/api/auth/verify-current-password', async (req, res) => {
  const { userId, currentPassword } = req.body || {};

  if (!userId || !currentPassword) {
    return res.status(400).json({ message: 'User ID and current password are required' });
  }

  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordValid =
      user.role === 'admin'
        ? currentPassword === ADMIN_PASSWORD
        : await verifyPassword(currentPassword, user.password_hash, user.role);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    return res.json({ message: 'Current password verified' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to verify current password', error: error.message });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body || {};

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'User ID, current password, and new password are required' });
  }

  const passwordErrors = getPasswordValidationErrors(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: `Password must include ${passwordErrors.join(', ')}` });
  }

  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordValid =
      user.role === 'admin'
        ? currentPassword === ADMIN_PASSWORD
        : await verifyPassword(currentPassword, user.password_hash, user.role);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const passwordHash = await hashPassword(newPassword);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user.id]);

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
});

app.post('/api/auth/oauth/google', async (req, res) => {
  const { mode = 'signin', email, role, name } = req.body || {};

  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role are required' });
  }

  if (role === 'admin' || role === 'support') {
    return res.status(403).json({ message: 'Google OAuth is not available for admin/support accounts' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidGmail(normalizedEmail)) {
    return res.status(400).json({ message: 'Google account email must be a valid @gmail.com address' });
  }

  try {
    const existingUser = await fetchUserByEmailAndRole(normalizedEmail, role);

    if (mode === 'signin') {
      if (!existingUser) {
        return res.status(404).json({ message: 'No account found for this Google email and role' });
      }
      await pool.query('UPDATE users SET last_login_at = now() WHERE id = $1', [existingUser.id]);
      return res.json(toAuthPayload(existingUser));
    }

    if (existingUser) {
      return res.json(toAuthPayload(existingUser));
    }

    const displayName = (name || normalizedEmail.split('@')[0] || 'Google User').trim();
    const generatedPasswordHash = await hashPassword(
      `google_oauth_${crypto.randomBytes(20).toString('hex')}`
    );

    const createdUser = await createUserWithRole({
      name: displayName,
      email: normalizedEmail,
      phone: null,
      passwordHash: generatedPasswordHash,
      role,
    });
    return res.status(201).json(toAuthPayload(createdUser));
  } catch (error) {
    const duplicateMessage = mapUniqueViolation(error);
    if (duplicateMessage) {
      return res.status(409).json({ message: duplicateMessage });
    }
    return res.status(500).json({ message: 'Google OAuth request failed', error: error.message });
  }
});

app.get('/auth/google/start', async (req, res) => {
  const mode = (req.query.mode || 'signin').toString();
  const role = (req.query.role || '').toString();

  if (mode !== 'signin' && mode !== 'signup') {
    return res.status(400).send('Invalid mode');
  }
  if (!['customer', 'restaurant', 'driver'].includes(role)) {
    return res.status(400).send('Invalid role');
  }
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(500).send('Google OAuth is not configured on server');
  }

  const state = issueOauthState({
    mode,
    role,
    clientUrl: getOauthClientUrl(req),
  });
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    state,
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get('/auth/google/callback', async (req, res) => {
  const code = (req.query.code || '').toString();
  const state = (req.query.state || '').toString();
  const error = (req.query.error || '').toString();

  if (error) {
    return res.redirect(`${CLIENT_URL}/signin?oauth_error=${encodeURIComponent(error)}`);
  }

  const oauthState = consumeOauthState(state);
  if (!oauthState || !code) {
    return res.redirect(`${CLIENT_URL}/signin?oauth_error=invalid_state`);
  }

  const oauthClientUrl = sanitizeClientUrl(oauthState.clientUrl) || CLIENT_URL;

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Google token exchange failed');
    }

    const tokenJson = await tokenResponse.json();
    if (!tokenJson.access_token) {
      throw new Error('Google access token missing');
    }

    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    if (!profileResponse.ok) {
      throw new Error('Google profile fetch failed');
    }

    const profile = await profileResponse.json();
    const googleEmail = (profile.email || '').toString().trim().toLowerCase();
    const googleName = (profile.name || '').toString().trim() || googleEmail.split('@')[0] || 'Google User';

    if (!googleEmail || profile.email_verified !== true) {
      throw new Error('Google email is missing or unverified');
    }
    if (!isValidGmail(googleEmail)) {
      throw new Error('Only Gmail addresses are allowed');
    }

    const existingUser = await fetchUserByEmailAndRole(googleEmail, oauthState.role);
    let authUser = existingUser;

    if (oauthState.mode === 'signin' && !existingUser) {
      return res.redirect(`${oauthClientUrl}/signin?oauth_error=${encodeURIComponent('No account found for this role')}`);
    }

    if (!authUser) {
      const generatedPasswordHash = await hashPassword(`google_oauth_${crypto.randomBytes(20).toString('hex')}`);
      authUser = await createUserWithRole({
        name: googleName,
        email: googleEmail,
        phone: null,
        passwordHash: generatedPasswordHash,
        role: oauthState.role,
      });
    }

    await pool.query('UPDATE users SET last_login_at = now() WHERE id = $1', [authUser.id]);
    const ticket = issueOauthTicket(toAuthPayload(authUser));
    const redirectPath = oauthState.mode === 'signup' ? '/signup' : '/signin';
    return res.redirect(`${oauthClientUrl}${redirectPath}?oauth_ticket=${encodeURIComponent(ticket)}`);
  } catch (callbackError) {
    return res.redirect(
      `${oauthClientUrl}/signin?oauth_error=${encodeURIComponent(callbackError.message || 'oauth_failed')}`
    );
  }
});

app.get('/api/auth/oauth/complete', (req, res) => {
  const ticket = (req.query.ticket || '').toString();
  const authPayload = consumeOauthTicket(ticket);
  if (!authPayload) {
    return res.status(400).json({ message: 'OAuth ticket is invalid or expired' });
  }

  if (ENABLE_2FA) {
    // Generate a 6-digit one-time code for 2FA (for demo/testing purposes only)
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFAKey = String(authPayload.id);
    twoFACodes.set(twoFAKey, twoFACode);
    console.log(`✅ 2FA code for user ${authPayload.email} (id=${authPayload.id}): ${twoFACode}`);

    return res.json({
      ...authPayload,
      twoFactorRequired: true,
      userId: authPayload.id,
    });
  }

  return res.json(authPayload);
});

const startServer = async () => {
  try {
    await ensureRestaurantImageColumn();
    if (httpsEnabled && hasHttpsPfx) {
      https.createServer(
        {
          pfx: fs.readFileSync(httpsPfxPath),
          passphrase: httpsPassphrase,
        },
        app
      ).listen(port, () => {
        console.log(`MealGo API server running on https://localhost:${port}`);
      });
      return;
    }

    if (httpsEnabled && !hasHttpsPfx) {
      console.warn(`DEV_HTTPS=true but certificate file was not found at ${httpsPfxPath}. Falling back to HTTP.`);
    }

    app.listen(port, () => {
      console.log(`MealGo API server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
