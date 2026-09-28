// inspect contract state
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const ethers = require('ethers');
const artifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artifact.abi, wallet);
  console.log('contract', process.env.NFT_CONTRACT_ADDRESS);
  console.log('tokenCount:', (await nft.tokenCount()).toString());
  try {
    console.log('ownerOf 0', await nft.ownerOf(0));
  } catch (e) {
    console.error('ownerOf 0 error', e.message);
  }
}

main().catch(console.error);
