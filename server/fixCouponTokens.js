// script to reconcile coupon token IDs for DB entries missing proper values
// run with `node server/fixCouponTokens.js` after setting up .env

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const ethers = require('ethers');
const artifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artifact.abi, wallet);

  const result = await pool.query(`
    SELECT id, code FROM coupons
    WHERE (nft_token_id IS NULL OR nft_token_id = 'unknown' OR nft_token_id = '')
      AND nft_contract_address = $1
  `, [process.env.NFT_CONTRACT_ADDRESS]);

  if (result.rows.length === 0) {
    console.log('no coupons needing token fix');
    process.exit(0);
  }

  const rows = result.rows;

  // build mapping code -> tokenId by iterating on-chain
  // tokenCount is the helper getter in current ABI
  const totalBn = await nft.tokenCount();
  const total = Number(totalBn.toString());
  const map = {};
  for (let i = 0; i < total; i++) {
    try {
      const code = await nft.couponCodes(i);
      map[code] = i;
    } catch (err) {
      // skip missing tokens
    }
  }

  for (const row of rows) {
    const tokenId = map[row.code];
    if (tokenId !== undefined) {
      await pool.query('UPDATE coupons SET nft_token_id = $1 WHERE id = $2', [tokenId.toString(), row.id]);
      console.log(`updated ${row.code} -> ${tokenId}`);
    } else {
      console.warn(`no on-chain token found for code ${row.code}`);
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});