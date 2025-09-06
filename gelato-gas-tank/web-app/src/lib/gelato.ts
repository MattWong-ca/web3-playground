import { GelatoRelay, CallWithERC2771Request } from '@gelatonetwork/relay-sdk-viem'
import { encodeFunctionData, type Address, type Hex, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { GELATO_RELAY_API_KEY, CONTRACT_ADDRESS, SIMPLE_MINT_ABI, GELATO_TRUSTED_FORWARDER_SEPOLIA } from './constants'

// Initialize Gelato Relay with ERC2771 configuration
const relay = new GelatoRelay({
  contract: {
    relay1BalanceERC2771: GELATO_TRUSTED_FORWARDER_SEPOLIA
  }
})

export type SponsoredTxResult = {
  taskId: string
  success: boolean
  error?: string
}

/**
 * Send a sponsored ERC2771 transaction to mint a token to the user
 */
export async function sponsoredMintToSelf(): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Get user's wallet client
    if (!window.ethereum) {
      throw new Error('MetaMask not found')
    }

    const [userAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[]

    const walletClient = createWalletClient({
      account: userAddress as Address,
      chain: sepolia,
      transport: custom(window.ethereum),
    })

    // Encode the function call
    const data = encodeFunctionData({
      abi: SIMPLE_MINT_ABI,
      functionName: 'mintToSelf',
    })

    // Create the ERC2771 sponsored call request
    const request: CallWithERC2771Request = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
      user: userAddress as Address,
    }

    console.log('Sending sponsored mintToSelf transaction...', request)

    // Send the sponsored ERC2771 call
    const response = await relay.sponsoredCallERC2771(request, walletClient, GELATO_RELAY_API_KEY)

    console.log('Sponsored mintToSelf response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored mintToSelf:', error)
    return {
      taskId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send a sponsored ERC2771 transaction to batch mint tokens
 */
export async function sponsoredBatchMint(quantity: number): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    if (quantity <= 0 || quantity > 5) {
      throw new Error('Quantity must be between 1 and 5')
    }

    // Get user's wallet client
    if (!window.ethereum) {
      throw new Error('MetaMask not found')
    }

    const [userAddress] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[]

    const walletClient = createWalletClient({
      account: userAddress as Address,
      chain: sepolia,
      transport: custom(window.ethereum),
    })

    // Encode the function call - batch mint to the user's address
    const data = encodeFunctionData({
      abi: SIMPLE_MINT_ABI,
      functionName: 'batchMint',
      args: [userAddress as Address, BigInt(quantity)],
    })

    // Create the ERC2771 sponsored call request
    const request: CallWithERC2771Request = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
      user: userAddress as Address,
    }

    console.log(`Sending sponsored batchMint(${quantity}) transaction...`, request)

    // Send the sponsored ERC2771 call
    const response = await relay.sponsoredCallERC2771(request, walletClient, GELATO_RELAY_API_KEY)

    console.log('Sponsored batchMint response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored batchMint:', error)
    return {
      taskId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check the status of a Gelato task
 */
export async function getTaskStatus(taskId: string) {
  try {
    const status = await relay.getTaskStatus(taskId)
    console.log('Task status:', status)
    return status
  } catch (error) {
    console.error('Error getting task status:', error)
    return null
  }
}
