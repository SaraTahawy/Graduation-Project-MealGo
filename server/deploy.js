require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

async function main() {
  const rpc = process.env.RPC_URL || 'http://127.0.0.1:7545';
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error('PRIVATE_KEY is not set in .env');

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const artifactPath = path.join(__dirname, 'artifacts', 'contracts', 'CouponNFT.sol', 'CouponNFT.json');
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npx hardhat compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log('Deploying CouponNFT via RPC:', rpc);
  // let ethers estimate gas automatically to avoid exceeding block gas limit
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const deployedAddress = await contract.getAddress();
  console.log('NFT deployed at:', deployedAddress);
  
  // Update .env
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/NFT_CONTRACT_ADDRESS=.*/, `NFT_CONTRACT_ADDRESS=${deployedAddress}`);
  fs.writeFileSync(envPath, envContent);
  console.log('.env updated with new contract address');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
