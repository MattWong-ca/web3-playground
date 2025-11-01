# Starknet MCP Server

A Model Context Protocol (MCP) server that connects AI assistants like Claude to the Starknet blockchain, enabling real-time access to wallet balances and token information.

## Features

- Check ETH and STRK token balances for any Starknet wallet address
- Real-time blockchain data access via MCP protocol
- Simple, single-file implementation
- TypeScript support with full type safety

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

## Configuration

To use this MCP server with Claude Desktop:

1. Open Claude Desktop
2. Click on the Settings icon
3. Navigate to the Developer section
4. Click "Edit Config" in the MCP Servers section
5. Add your server configuration:

```json
{
  "mcpServers": {
    "starknet-reader": {
      "command": "node",
      "args": ["/full/path/to/starknet-mcp/dist/index.js"]
    }
  }
}
```

Replace `/full/path/to/starknet-mcp/dist/index.js` with the actual absolute path to your compiled JavaScript file.

6. Save the configuration
7. Toggle the switch next to "starknet-reader" to enable it

## Usage

Once configured, you can ask Claude questions like:

- "What's the ETH balance for this Starknet address: 0x0736a05dc46efaf497f14a59464e50f8c02d41e4cdc4b12d0fdffd9342872f7e?"
- "Can you check the STRK balance for wallet 0x0736a05dc46efaf497f14a59464e50f8c02d41e4cdc4b12d0fdffd9342872f7e on Starknet?"

Claude will use the MCP server to fetch real-time data from the Starknet blockchain.

## Supported Tokens

- ETH (Ethereum)
- STRK (Starknet)

## Project Structure

```
starknet-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Building

```bash
npm run build
```

### Running

```bash
npm start
```

## Extending the Server

This minimal server can be expanded in many ways:

- Add support for more tokens
- Implement transaction history checking
- Add price data to convert token amounts to USD
- Enable interaction with smart contracts
- Support other networks like Starknet testnet

## License

MIT

