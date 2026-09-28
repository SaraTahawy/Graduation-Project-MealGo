require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { ethers } = require('ethers');
const NFT_ABI = require('./NFT_ABI.json');

async function run() {
  const rpc = process.env.RPC_URL || 'http://127.0.0.1:7545';
  const provider = new ethers.JsonRpcProvider(rpc);

  console.log('RPC URL:', rpc);
  try {
    const block = await provider.getBlockNumber();
    console.log('Block number:', block);
  } catch (err) {
    console.error('Failed to reach RPC:', err.message);
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('No PRIVATE_KEY in .env');
  } else {
    const wallet = new ethers.Wallet(privateKey, provider);
    const bal = await provider.getBalance(wallet.address);
    console.log('Admin wallet:', wallet.address, '| balance:', ethers.formatEther(bal), 'ETH');
  }

  const userArg = process.argv[2];
  if (!userArg) {
    console.log('Usage: node check_nft_debug.js <userWalletAddress>');
  } else {
    try {
      const userBal = await provider.getBalance(userArg);
      console.log('User wallet:', userArg, '| balance:', ethers.formatEther(userBal), 'ETH');
    } catch (err) {
      console.error('Failed to read user balance:', err.message);
    }
  }

  const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('No NFT_CONTRACT_ADDRESS in .env');
    return;
  }

  console.log('NFT contract:', contractAddress);
  const contract = new ethers.Contract(contractAddress, NFT_ABI, provider);
  try {
    const tc = await contract.tokenCount();
    console.log('Contract tokenCount:', tc.toString());
  } catch (err) {
    console.error('Failed to read tokenCount:', err.message);
  }
}

run().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
