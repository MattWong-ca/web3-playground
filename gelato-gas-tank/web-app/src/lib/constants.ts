// Environment variables and constants
export const GELATO_RELAY_API_KEY = process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY || '';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
export const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';

// Gelato trusted forwarder for Sepolia (for ERC2771)
// From: https://docs.gelato.network/developer-services/relay/supported-networks
export const GELATO_TRUSTED_FORWARDER_SEPOLIA = '0xd8253782c45a12053594b9deB72d8e8aB2Fca54c';

// Counter contract ABI
export const COUNTER_ABI = [
  {
    "inputs": [],
    "name": "inc",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "by",
        "type": "uint256"
      }
    ],
    "name": "incBy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "x",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "by",
        "type": "uint256"
      }
    ],
    "name": "Increment",
    "type": "event"
  }
] as const;
