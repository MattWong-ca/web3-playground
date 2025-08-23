import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk-viem'
import { encodeFunctionData, type Address, type Hex } from 'viem'
import { sepolia } from 'viem/chains'
import { GELATO_RELAY_API_KEY, CONTRACT_ADDRESS, SIMPLE_COUNTER_ABI } from './constants'

// Initialize Gelato Relay
const relay = new GelatoRelay()

export type SponsoredTxResult = {
  taskId: string
  success: boolean
  error?: string
}

/**
 * Send a sponsored transaction to increment the counter
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
      abi: SIMPLE_COUNTER_ABI,
      functionName: 'increment',
    })

    // Create the sponsored call request
    const request: SponsoredCallRequest = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
    }

    console.log('Sending sponsored transaction...', request)

    // Send the sponsored call
    const response = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY)

    console.log('Sponsored transaction response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored transaction:', error)
    return {
      taskId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send a sponsored transaction to decrement the counter
 */
export async function sponsoredDecrement(): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Encode the function call
    const data = encodeFunctionData({
      abi: SIMPLE_COUNTER_ABI,
      functionName: 'decrement',
    })

    // Create the sponsored call request
    const request: SponsoredCallRequest = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
    }

    console.log('Sending sponsored decrement transaction...', request)

    // Send the sponsored call
    const response = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY)

    console.log('Sponsored decrement response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored decrement:', error)
    return {
      taskId: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send a sponsored transaction to reset the counter
 */
export async function sponsoredReset(): Promise<SponsoredTxResult> {
  try {
    if (!GELATO_RELAY_API_KEY) {
      throw new Error('Gelato API key not configured')
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('Contract address not configured')
    }

    // Encode the function call
    const data = encodeFunctionData({
      abi: SIMPLE_COUNTER_ABI,
      functionName: 'reset',
    })

    // Create the sponsored call request
    const request: SponsoredCallRequest = {
      chainId: BigInt(sepolia.id),
      target: CONTRACT_ADDRESS as Address,
      data: data as Hex,
    }

    console.log('Sending sponsored reset transaction...', request)

    // Send the sponsored call
    const response = await relay.sponsoredCall(request, GELATO_RELAY_API_KEY)

    console.log('Sponsored reset response:', response)

    return {
      taskId: response.taskId,
      success: true,
    }
  } catch (error) {
    console.error('Error sending sponsored reset:', error)
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
