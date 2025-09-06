import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleMintModule", (m) => {
  // Gelato's trusted forwarder for Sepolia
  // This address is from Gelato's official documentation
  const trustedForwarder = "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c";
  
  // Deploy the SimpleMint contract with the trusted forwarder
  const simpleMint = m.contract("SimpleMint", [trustedForwarder]);
  
  // Optional: Mint a test token during deployment to verify everything works
  // This will mint to the deployer's address
  // m.call(simpleMint, "mintToSelf", []);
  
  return { simpleMint };
});
