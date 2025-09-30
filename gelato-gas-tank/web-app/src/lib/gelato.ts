import { GelatoRelay, CallWithERC2771Request } from '@gelatonetwork/relay-sdk'
import { ethers } from 'ethers'
import { GELATO_RELAY_API_KEY, CONTRACT_ADDRESS, GELATO_COUNTER_ABI, GELATO_TRUSTED_FORWARDER_SEPOLIA } from './constants'

// Initialize Gelato Relay with ERC2771 configuration
// Following the official docs pattern
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
 * Send a sponsored ERC2771 transaction to increment the counter (Following Gelato Docs Exactly)
 */
export async function sponsoredIncrement(): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Following the docs pattern exactly
    if (!window.ethereum) {
      throw new Error('MetaMask not found')
    }

    // Set up ethers provider and signer as per docs
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const user = await signer.getAddress()

    // Generate the target payload using Gelato's official contract ABI
    const contract = new ethers.Contract(CONTRACT_ADDRESS, GELATO_COUNTER_ABI, signer)
    const { data } = await contract.increment.populateTransaction()

    // Populate a relay request exactly as docs show
    const request: CallWithERC2771Request = {
      chainId: (await provider.getNetwork()).chainId,
      target: CONTRACT_ADDRESS,
      data: data,
      user: user,
    }

    console.log('Sending sponsored increment transaction...', request)

    // Send a relay request using Gelato Relay exactly as docs show
    const relayResponse = await relay.sponsoredCallERC2771(request, provider, GELATO_RELAY_API_KEY)

    console.log('Sponsored increment response:', relayResponse)

    return {
      taskId: relayResponse.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored increment:', error)
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
