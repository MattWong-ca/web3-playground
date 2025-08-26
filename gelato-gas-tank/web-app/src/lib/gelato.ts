import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk-viem'
import { encodeFunctionData, type Address, type Hex } from 'viem'
import { sepolia } from 'viem/chains'
import { GELATO_RELAY_API_KEY, CONTRACT_ADDRESS, COUNTER_ABI } from './constants'

// Initialize Gelato Relay
const relay = new GelatoRelay()

export type SponsoredTxResult = {
  taskId: string
  success: boolean
  error?: string
}

/**
 * Send a sponsored transaction to increment the counter by 1
 */
export async function sponsoredIncrement(): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Encode the function call
    const data = encodeFunctionData({
      abi: COUNTER_ABI,
      functionName: 'inc',
    })

    // Create the sponsored call request
    const request: SponsoredCallRequest = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
    }

    console.log('Sending sponsored increment transaction...', request)

    // Send the sponsored call
    const response = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY)

    console.log('Sponsored increment response:', response)

    return {
      taskId: response.taskId,
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
 * Send a sponsored transaction to increment the counter by a specific amount
 */
export async function sponsoredIncrementBy(amount: number): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    if (amount <= 0) {
      throw new Error('Increment amount must be positive')
    }

    // Encode the function call
    const data = encodeFunctionData({
      abi: COUNTER_ABI,
      functionName: 'incBy',
      args: [BigInt(amount)],
    })

    // Create the sponsored call request
    const request: SponsoredCallRequest = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
    }

    console.log(`Sending sponsored incrementBy(${amount}) transaction...`, request)

    // Send the sponsored call
    const response = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY)

    console.log('Sponsored incrementBy response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored incrementBy:', error)
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
