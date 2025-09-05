import { getContract, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  console.log(`Deploying Counter contract to network: ${hre.network.name}`);
  
  try {
    // Get the deployer account
    const [deployer] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();
    
    console.log(`🔑 Deploying from account: ${deployer.account.address}`);
    
    // Get account balance
    const balance = await publicClient.getBalance({
      address: deployer.account.address,
    });
    console.log(`💰 Account balance: ${balance} wei`);
    
    // Deploy the contract
    console.log("🚀 Deploying Counter contract...");
    
    const counter = await hre.viem.deployContract("Counter", []);
    
    console.log("✅ Counter contract deployed successfully!");
    console.log(`📍 Contract address: ${counter.address}`);
    console.log(`🔗 Network: ${hre.network.name}`);
    console.log(`⛽ Gas used: ${counter.receipt?.gasUsed || 'N/A'}`);
    
    // Verify the deployment by reading the initial value
    const initialValue = await counter.read.x();
    console.log(`📊 Initial counter value: ${initialValue}`);
    
    // Optional: Call incBy function to test the contract
    if (hre.network.name !== "mainnet") {
      console.log("🧪 Testing contract functionality...");
      const tx = await counter.write.incBy([5n]);
      await publicClient.waitForTransactionReceipt({ hash: tx });
      
      const newValue = await counter.read.x();
      console.log(`📊 Counter value after incBy(5): ${newValue}`);
    }
    
    return {
      contractAddress: counter.address,
      contract: counter,
      network: hre.network.name,
      deployer: deployer.account.address
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Run the deployment if this script is executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default main;
