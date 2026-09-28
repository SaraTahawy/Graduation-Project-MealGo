require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const ethers = require('ethers');
const artifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');
const { pool } = require('./db');

const router = express.Router();

// Initialize provider and wallet with logging
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftContract = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artifact.abi, wallet);

console.log('✅ NFT Service initialized:', {
  provider: process.env.RPC_URL,
  wallet: wallet.address,
  contract: process.env.NFT_CONTRACT_ADDRESS,
});

// utility handler used by both admin and user mounts
async function getUserCouponsHandler(req, res) {
  const { walletAddress } = req.query;
  if (!walletAddress) {
    return res.status(400).json({ error: 'walletAddress is required' });
  }

  try {
    // fetch all active coupons that have an NFT token id attached
    const query = `
      SELECT id, code, discount_type, discount_value, min_order_value, status, nft_token_id, valid_from, valid_until
      FROM coupons
      WHERE nft_contract_address = $1 AND status = 'active'
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [process.env.NFT_CONTRACT_ADDRESS]);

    const ownerLower = walletAddress.toString().toLowerCase();
    const allItems = [];

    // iterate rows and attach owner info for debugging
    for (const row of result.rows) {
      const item = { ...row, onChainOwner: null, ownerMatch: null };

      if (row.nft_token_id && row.nft_token_id !== 'unknown') {
        try {
          const owner = await nftContract.ownerOf(row.nft_token_id);
          item.onChainOwner = owner;
          item.ownerMatch = owner.toLowerCase() === ownerLower;
        } catch (err) {
          // token might not exist or be burned; record error
          item.onChainOwner = 'error';
        }
      }

      allItems.push(item);
    }

    // return only those actually owned by the connected wallet
    const filtered = allItems.filter((c) => c.ownerMatch === true || c.nft_token_id == null);
    res.json({ coupons: filtered });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
}

// attach to router under /coupons
router.get('/coupons', getUserCouponsHandler);

// also export for direct mounting
module.exports = router;
module.exports.getUserCouponsHandler = getUserCouponsHandler;

// POST /api/admin/create-coupon
// body: { code, discountType, discountValue, walletAddress, /*optional*/ validFrom, validUntil }
router.post('/create-coupon', async (req, res) => {
  const { code, discountType, discountValue, walletAddress, validFrom, validUntil } = req.body || {};
  
  console.log('📥 Create coupon request:', { code, discountType, discountValue, walletAddress });
  
  if (!code || !discountType || discountValue === undefined || !walletAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // do not mint coupons to the admin account by mistake
  if (walletAddress.toString().toLowerCase() === wallet.address.toLowerCase()) {
    return res.status(400).json({ error: 'Cannot mint coupon to admin wallet' });
  }

  try {
    // 1️⃣ admin balance check
    console.log('🔍 Checking admin balance...');
    const adminBalance = await provider.getBalance(wallet.address);
    console.log('  Admin balance:', ethers.formatEther(adminBalance), 'ETH');
    if (adminBalance === 0n) {
      return res.status(400).json({ error: 'Admin wallet has 0 balance. Add ETH first.' });
    }

    // 2️⃣ user balance check
    console.log('🔍 Checking user balance...');
    const userBalance = await provider.getBalance(walletAddress);
    console.log('  User balance:', ethers.formatEther(userBalance), 'ETH');
    if (userBalance === 0n) {
      return res.status(400).json({ error: 'User wallet has 0 balance. User needs ETH to receive NFT.' });
    }

    // 3️⃣ mint NFT on chain (artifact ABI expects: mintCoupon(address to, string code, uint256 value))
    console.log('⛓️  Minting NFT...');
    // call mintCoupon and capture returned tokenId
    const tx = await nftContract.mintCoupon(walletAddress, code, Number(discountValue));
    console.log('  Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('  Transaction mined. Receipt:', receipt?.blockNumber);
    if (!receipt) {
      throw new Error('Transaction failed - no receipt returned');
    }

    // Try to read tokenId from event first. we don't trust the ABI; decode logs manually
    let tokenId;

    // primary assumption: contract emits CouponMinted event
    const mintedIface = new ethers.Interface([
      'event CouponMinted(address indexed to, uint256 indexed tokenId, string code, uint256 value)'
    ]);

    for (const log of receipt.logs) {
      try {
        const parsed = mintedIface.parseLog(log);
        if (parsed && parsed.name === 'CouponMinted') {
          tokenId = parsed.args.tokenId.toString();
          break;
        }
      } catch (err) {
        // ignore logs that don't match
      }
    }

    // fallback: use the standard ERC‑721 Transfer event which every mint emits as from=0x0
    if (tokenId === undefined) {
      const transferIface = new ethers.Interface([
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
      ]);
      for (const log of receipt.logs) {
        try {
          const parsed = transferIface.parseLog(log);
          if (parsed && parsed.name === 'Transfer') {
            tokenId = parsed.args.tokenId.toString();
            break;
          }
        } catch (err) {
          // ignore non‑transfer logs
        }
      }
    }

    // if we still didn't decode, attempt callStatic (ABI may or may not contain output)
    if (tokenId === undefined) {
      try {
        const maybe = await nftContract.callStatic.mintCoupon(walletAddress, code, Number(discountValue));
        if (maybe !== undefined) tokenId = maybe.toString();
      } catch (err) {
        // ignore
      }
    }

    if (tokenId === undefined) {
      console.warn('  Unable to determine tokenId from receipt or callStatic, returning unknown');
      tokenId = 'unknown';
    }
    console.log('  Calculated tokenId:', tokenId);

    // 4️⃣ insert coupon record in database
    console.log('💾 Inserting coupon into database...');
    const now = new Date();
    // default valid period 24h if not provided
    const start = validFrom ? new Date(validFrom) : now;
    const end = validUntil ? new Date(validUntil) : new Date(start.getTime() + 24 * 60 * 60 * 1000);
    // ensure end > start
    if (end <= start) {
      end.setTime(start.getTime() + 60 * 1000); // add one minute
    }
    const insertQuery = `
      INSERT INTO coupons
        (code, description, discount_type, discount_value, min_order_value, status,
         nft_token_id, nft_contract_address, valid_from, valid_until, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;
    const dbRes = await pool.query(insertQuery, [
      code,
      '',
      discountType === 'free-delivery' ? 'free_delivery' : discountType,
      Number(discountValue),
      0,
      'active',
      tokenId,
      process.env.NFT_CONTRACT_ADDRESS,
      start.toISOString(),
      end.toISOString(),
      now.toISOString(),
      now.toISOString()
    ]);
    
    const couponId = dbRes.rows[0]?.id;
    console.log('✅ Coupon created with ID:', couponId);

    res.json({
      success: true,
      tokenId,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      couponId,
      transactionHash: tx.hash,
      message: 'NFT coupon created successfully'
    });
  } catch (err) {
    console.error('❌ Error creating NFT coupon:');
    console.error('  Message:', err.message);
    console.error('  Stack:', err.stack);
    res.status(500).json({
      error: 'Failed to mint NFT coupon',
      details: err.message,
      type: err.constructor.name
    });
  }
});

module.exports = router;


