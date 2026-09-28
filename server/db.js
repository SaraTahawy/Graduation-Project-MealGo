const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 6000),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mealgo_db',
});

// ensure coupons table has nft columns (migration)
(async () => {
  try {
    await pool.query(`
      ALTER TABLE coupons
      ADD COLUMN IF NOT EXISTS nft_token_id TEXT,
      ADD COLUMN IF NOT EXISTS nft_contract_address TEXT;
    `);
    console.log('✅ coupons table ensured nft columns');
  } catch (err) {
    console.error('⚠️  Failed to add nft columns to coupons:', err.message);
  }
})();

module.exports = { pool };
