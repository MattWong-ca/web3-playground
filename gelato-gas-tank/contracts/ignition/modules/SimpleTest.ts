import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleTestModule", (m) => {
  // Gelato's trusted forwarder for Sepolia (correct address)
  const trustedForwarder = "0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d";
  
  // Deploy the SimpleTest contract with the trusted forwarder
  const simpleTest = m.contract("SimpleTest", [trustedForwarder]);
  
  return { simpleTest };
});
