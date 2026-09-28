require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { ethers } = require('ethers');
(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const code = await provider.getCode(process.env.NFT_CONTRACT_ADDRESS);
  console.log('code length', code.length, code.slice(0, 100));
})();
