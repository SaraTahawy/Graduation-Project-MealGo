require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
(async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mealgo_db',
  });
  const res = await pool.query("select id, code, nft_token_id, nft_contract_address from coupons where nft_token_id is null or nft_token_id='unknown' or nft_token_id='';");
  console.log(res.rows);
  await pool.end();
})();
