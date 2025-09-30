'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { sponsoredIncrement, getTaskStatus } from '~/lib/gelato'
import { CONTRACT_ADDRESS, GELATO_COUNTER_ABI, GELATO_RELAY_API_KEY } from '~/lib/constants'

export function SponsoredTransactionDemo() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  
  const [isLoading, setIsLoading] = useState(false)
  const [lastTaskId, setLastTaskId] = useState<string>('')
  const [taskStatus, setTaskStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  // Read user's counter from Gelato's official contract
  const { data: userCounter, refetch: refetchUserCounter } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GELATO_COUNTER_ABI,
    functionName: 'contextCounter',
    args: [address as `0x${string}`],
    query: {
      enabled: !!CONTRACT_ADDRESS && !!address && isConnected,
    },
  })

  // Poll task status
  useEffect(() => {
    if (!lastTaskId) return

    const pollStatus = async () => {
      const status = await getTaskStatus(lastTaskId)
      if (status) {
        setTaskStatus(JSON.stringify(status, null, 2))
        
        // If task is successful, refresh contract data
        if (status.taskState === 'ExecSuccess') {
          setTimeout(() => {
            refetchUserCounter()
          }, 2000)
        }
      }
    }

    const interval = setInterval(pollStatus, 3000)
    pollStatus() // Initial call

    return () => clearInterval(interval)
  }, [lastTaskId, refetchUserCounter])

  const handleSponsoredTransaction = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!GELATO_RELAY_API_KEY) {
      setError('Gelato API key not configured. Please set NEXT_PUBLIC_GELATO_RELAY_API_KEY in your environment.')
      return
    }

    if (!CONTRACT_ADDRESS) {
      setError('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment.')
      return
    }

    setIsLoading(true)
    setError('')
    setTaskStatus('')

    try {
      const result = await sponsoredIncrement()

      if (result.success) {
        setLastTaskId(result.taskId)
        setError('')
      } else {
        setError(result.error || 'Transaction failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const ConfigurationStatus = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Configuration Status
      </h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${GELATO_RELAY_API_KEY ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">Gelato API Key: {GELATO_RELAY_API_KEY ? '✓ Configured' : '✗ Not configured'}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${CONTRACT_ADDRESS ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">Contract Address: {CONTRACT_ADDRESS ? '✓ Configured' : '✗ Not configured'}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-sm">Wallet: {isConnected ? '✓ Connected' : '⚠ Not connected'}</span>
        </div>
      </div>
      
      {!GELATO_RELAY_API_KEY && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            To use sponsored transactions, you need to:
            <br />
            1. Get a Gelato API key from <a href="https://app.gelato.network/" target="_blank" rel="noopener noreferrer" className="underline">app.gelato.network</a>
            <br />
            2. Set NEXT_PUBLIC_GELATO_RELAY_API_KEY in your environment
            <br />
            3. Deploy the contract and set NEXT_PUBLIC_CONTRACT_ADDRESS
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <ConfigurationStatus />
      
      {/* Wallet Connection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Wallet Connection
        </h3>
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connected: {address}
              </p>
            </div>
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Contract Interaction */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gelato's Official Test Contract
        </h3>
        
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg mb-6">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Personal Counter
          </h4>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {userCounter?.toString() || '0'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Each user has their own counter mapped to their address
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleSponsoredTransaction}
              disabled={isLoading || !isConnected}
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold shadow-lg"
            >
              {isLoading ? 'Processing...' : '🚀 Sponsored Increment!'}
            </button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-center text-sm text-blue-800 dark:text-blue-200">
              <strong>Using Gelato's Official Test Contract:</strong> This calls the <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">increment()</code> function using ERC2771.
              <br />
              Testing with their deployed contract to isolate the issue.
              <br />
              <span className="text-xs">Contract: {CONTRACT_ADDRESS}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {(error || taskStatus || lastTaskId) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transaction Status
          </h3>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-medium">Error:</p>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {lastTaskId && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-medium">Task ID:</p>
              <p className="text-blue-600 dark:text-blue-300 text-sm font-mono break-all">{lastTaskId}</p>
            </div>
          )}
          
          {taskStatus && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">Task Status:</p>
              <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                {taskStatus}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
