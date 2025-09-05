import { ignition, network } from "hardhat";
import CounterModule from "../ignition/modules/Counter.js";

async function main() {
  console.log(`Deploying Counter contract to network: ${network.name}`);
  
  try {
    // Deploy using Hardhat Ignition
    const { counter } = await ignition.deploy(CounterModule);
    
    console.log("✅ Counter contract deployed successfully!");
    console.log(`📍 Contract address: ${counter.target}`);
    console.log(`🔗 Network: ${network.name}`);
    
    // Get the current counter value
    const currentValue = await counter.read.x();
    console.log(`📊 Current counter value: ${currentValue}`);
    
    return {
      contractAddress: counter.target,
      contract: counter,
      network: network.name
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
