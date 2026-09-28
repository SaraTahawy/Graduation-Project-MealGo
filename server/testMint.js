// simple script to mint a test coupon and print tokenId
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const ethers = require('ethers');
const artifact = require('./artifacts/contracts/CouponNFT.sol/CouponNFT.json');

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const nft = new ethers.Contract(process.env.NFT_CONTRACT_ADDRESS, artifact.abi, wallet);
  console.log('Minting with contract', process.env.NFT_CONTRACT_ADDRESS);
  const tx = await nft.mintCoupon(wallet.address, 'TEST123', 10);
  console.log('tx hash', tx.hash);
  const receipt = await tx.wait();
  console.log('receipt status', receipt.status, 'blockNumber', receipt.blockNumber);
  console.log('receipt logs', receipt.logs);
  let tokenId;
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
    } catch (err) {}
  }
  if (tokenId === undefined) {
    try {
      const maybe = await nft.callStatic.mintCoupon(wallet.address, 'TEST123', 10);
      if (maybe !== undefined) tokenId = maybe.toString();
  console.log('callStatic result', maybe);
    } catch (err) {}
  }
  console.log('determined tokenId', tokenId);
}

main().catch(console.error);
