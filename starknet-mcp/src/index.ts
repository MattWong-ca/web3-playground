import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { RpcProvider } from "starknet";

// Initialize Starknet provider
const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_7" });

// ERC20 token addresses on Starknet mainnet
const TOKEN_ADDRESSES: Record<string, string> = {
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
};

// Validate Starknet address format
function isValidStarknetAddress(address: string): boolean {
  try {
    return /^0x[0-9a-fA-F]{63,64}$/.test(address);
  } catch {
    return false;
  }
}

// Check token balance for an address
async function checkBalance(address: string, token: string): Promise<{ address: string; token: string; balance: string; balanceFormatted: string }> {
  const tokenAddress = TOKEN_ADDRESSES[token];
  if (!tokenAddress) {
    throw new Error(`Token ${token} not supported`);
  }

  // Call the balanceOf function
  const result = await provider.callContract({
    contractAddress: tokenAddress,
    entrypoint: "balanceOf",
    calldata: [address],
  });

  // Parse the balance (Starknet uses felt252 which is a big number)
  const balance = result[0];
  const balanceBigInt = BigInt(balance);
  
  // Format balance (ETH and STRK have 18 decimals)
  const decimals = 18;
  const divisor = BigInt(10 ** decimals);
  const wholePart = balanceBigInt / divisor;
  const fractionalPart = balanceBigInt % divisor;
  const balanceFormatted = `${wholePart}.${fractionalPart.toString().padStart(decimals, "0")}`;

  return {
    address,
    token,
    balance: balance.toString(),
    balanceFormatted,
  };
}

// Create MCP server
const server = new Server(
  {
    name: "starknet-reader",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_balance",
        description: "Check the token balance (ETH or STRK) for a Starknet wallet address",
        inputSchema: {
          type: "object",
          properties: {
            address: {
              type: "string",
              description: "The Starknet wallet address (0x format)",
            },
            token: {
              type: "string",
              description: "The token symbol (ETH or STRK)",
              enum: ["ETH", "STRK"],
            },
          },
          required: ["address", "token"],
        },
      },
    ],
  };
});

// Implement tool functionality
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name !== "check_balance") {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const address = String(args?.address);
    const token = String(args?.token).toUpperCase();

    // Validate inputs
    if (!address) throw new Error("Address is required");
    if (!token) throw new Error("Token is required");
    if (!isValidStarknetAddress(address)) throw new Error("Invalid Starknet address");
    if (token !== "ETH" && token !== "STRK") throw new Error("Supported tokens: ETH, STRK");

    const result = await checkBalance(address, token);

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Starknet Reader MCP Server running");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

