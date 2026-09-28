require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const ethers = require('ethers');
const artifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');
(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artifact.abi, wallet);
  console.log('contract functions:', Object.keys(nft));
  console.log('tokenCounter property', nft.tokenCounter);
  try {
    console.log('tokenCounter()', await nft.tokenCounter());
  } catch(err){
    console.error('call tokenCounter()', err.message);
  }
  try{
    console.log('tokenCount()', await nft.tokenCount());
  }catch(err){
    console.error('call tokenCount()', err.message);
  }
})();