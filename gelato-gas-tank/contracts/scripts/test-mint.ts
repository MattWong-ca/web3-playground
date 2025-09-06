import hre from "hardhat";

async function main() {
  console.log("Testing SimpleMint contract directly...");
  
  const contractAddress = "0x3592c351c4Ce0c4D43bfAd1a9B6C023E5a3439C8";
  
  // Get the deployer account
  const [deployer] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();
  
  console.log(`Testing from account: ${deployer.account.address}`);
  
  // Get the contract instance
  const simpleMint = await hre.viem.getContractAt("SimpleMint", contractAddress);
  
  try {
    // Test 1: Check current state
    console.log("\n=== Current State ===");
    const totalSupply = await simpleMint.read.totalSupply();
    const userBalance = await simpleMint.read.balanceOf([deployer.account.address]);
    const userMinted = await simpleMint.read.mintedBy([deployer.account.address]);
    const remainingMints = await simpleMint.read.remainingMintsFor([deployer.account.address]);
    
    console.log(`Total Supply: ${totalSupply}`);
    console.log(`Your Balance: ${userBalance}`);
    console.log(`You've Minted: ${userMinted}`);
    console.log(`Remaining Mints: ${remainingMints}`);
    
    // Test 2: Try direct mint (this should work)
    console.log("\n=== Testing Direct Mint ===");
    const tx = await simpleMint.write.mintToSelf();
    console.log(`Transaction hash: ${tx}`);
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    
    // Check updated state
    console.log("\n=== Updated State ===");
    const newTotalSupply = await simpleMint.read.totalSupply();
    const newUserBalance = await simpleMint.read.balanceOf([deployer.account.address]);
    const newUserMinted = await simpleMint.read.mintedBy([deployer.account.address]);
    const newRemainingMints = await simpleMint.read.remainingMintsFor([deployer.account.address]);
    
    console.log(`Total Supply: ${newTotalSupply}`);
    console.log(`Your Balance: ${newUserBalance}`);
    console.log(`You've Minted: ${newUserMinted}`);
    console.log(`Remaining Mints: ${newRemainingMints}`);
    
    // Test 3: Check who the contract thinks is the minter
    console.log("\n=== Testing getMinter function ===");
    const minter = await simpleMint.read.getMinter();
    console.log(`getMinter() returns: ${minter}`);
    console.log(`Expected (your address): ${deployer.account.address}`);
    console.log(`Match: ${minter.toLowerCase() === deployer.account.address.toLowerCase()}`);
    
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export default main;
