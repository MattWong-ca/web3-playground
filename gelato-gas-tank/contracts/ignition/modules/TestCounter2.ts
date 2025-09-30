import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestCounter2Module", (m) => {
  // Gelato's trusted forwarder for Sepolia (from official docs for sponsoredCallERC2771)
  const trustedForwarder = "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c";
  
  // Deploy the TestCounter2 contract with the trusted forwarder
  const testCounter2 = m.contract("TestCounter2", [trustedForwarder]);
  
  return { testCounter2 };
});
