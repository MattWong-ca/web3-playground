import hre from "hardhat";

async function main() {
  console.log("Testing SimpleTest contract directly...");
  
  const contractAddress = "0xB72B212112072F195858599bd6DbCD27204225F2";
  
  // Get the deployer account
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();
  
  console.log(`Testing from account: ${deployer.account.address}`);
  
  // Get the contract instance
  const simpleTest = await hre.viem.getContractAt("SimpleTest", contractAddress);
  
  try {
    // Test 1: Check current state
    console.log("\n=== Current State ===");
    const clickCount = await simpleTest.read.clickCount();
    const userClickCount = await simpleTest.read.userClickCount([deployer.account.address]);
    const lastClicker = await simpleTest.read.lastClicker();
    
    console.log(`Total Clicks: ${clickCount}`);
    console.log(`Your Clicks: ${userClickCount}`);
    console.log(`Last Clicker: ${lastClicker}`);
    
    // Test 2: Try direct click (this should work)
    console.log("\n=== Testing Direct Click ===");
    const tx = await simpleTest.write.clickButton();
    console.log(`Transaction hash: ${tx}`);
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    
    // Check updated state
    console.log("\n=== Updated State ===");
    const newClickCount = await simpleTest.read.clickCount();
    const newUserClickCount = await simpleTest.read.userClickCount([deployer.account.address]);
    const newLastClicker = await simpleTest.read.lastClicker();
    
    console.log(`Total Clicks: ${newClickCount}`);
    console.log(`Your Clicks: ${newUserClickCount}`);
    console.log(`Last Clicker: ${newLastClicker}`);
    
    // Test 3: Check who the contract thinks is the current clicker
    console.log("\n=== Testing getCurrentClicker function ===");
    const currentClicker = await simpleTest.read.getCurrentClicker();
    console.log(`getCurrentClicker() returns: ${currentClicker}`);
    console.log(`Expected (your address): ${deployer.account.address}`);
    console.log(`Match: ${currentClicker.toLowerCase() === deployer.account.address.toLowerCase()}`);
    
    console.log("\n✅ Contract works perfectly with direct calls!");
    
  } catch (error) {
    console.error("❌ Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default main;
