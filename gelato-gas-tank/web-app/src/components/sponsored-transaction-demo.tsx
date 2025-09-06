'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { sponsoredMintToSelf, sponsoredBatchMint, getTaskStatus } from '~/lib/gelato'
import { CONTRACT_ADDRESS, SIMPLE_MINT_ABI, GELATO_RELAY_API_KEY } from '~/lib/constants'

export function SponsoredTransactionDemo() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  
  const [isLoading, setIsLoading] = useState(false)
  const [lastTaskId, setLastTaskId] = useState<string>('')
  const [taskStatus, setTaskStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [mintQuantity, setMintQuantity] = useState<number>(2)

  // Read contract data - total supply
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_MINT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!CONTRACT_ADDRESS,
    },
  })

  // Read user's balance
  const { data: userBalance, refetch: refetchUserBalance } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_MINT_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    query: {
      enabled: !!CONTRACT_ADDRESS && !!address && isConnected,
    },
  })

  // Read user's minted count
  const { refetch: refetchUserMintedCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_MINT_ABI,
    functionName: 'mintedBy',
    args: [address as `0x${string}`],
    query: {
      enabled: !!CONTRACT_ADDRESS && !!address && isConnected,
    },
  })

  // Read remaining mints for user
  const { data: remainingMints, refetch: refetchRemainingMints } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_MINT_ABI,
    functionName: 'remainingMintsFor',
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
            refetchTotalSupply()
            refetchUserBalance()
            refetchUserMintedCount()
            refetchRemainingMints()
          }, 2000)
        }
      }
    }

    const interval = setInterval(pollStatus, 3000)
    pollStatus() // Initial call

    return () => clearInterval(interval)
  }, [lastTaskId, refetchTotalSupply, refetchUserBalance, refetchUserMintedCount, refetchRemainingMints])

  const handleSponsoredTransaction = async (action: 'mintToSelf' | 'batchMint') => {
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
      let result
      switch (action) {
        case 'mintToSelf':
          result = await sponsoredMintToSelf()
          break
        case 'batchMint':
          result = await sponsoredBatchMint(mintQuantity)
          break
      }

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
          SimpleMint Contract (ERC2771)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Total Supply
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalSupply?.toString() || '0'} / 1000
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Your Balance
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {userBalance?.toString() || '0'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Remaining Mints
            </h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {remainingMints?.toString() || '0'} / 10
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleSponsoredTransaction('mintToSelf')}
              disabled={isLoading || !isConnected || (remainingMints !== undefined && remainingMints <= BigInt(0))}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : '🎁 Sponsored Mint (1 Token)'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Batch mint quantity:
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={mintQuantity}
              onChange={(e) => setMintQuantity(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => handleSponsoredTransaction('batchMint')}
              disabled={isLoading || !isConnected || (remainingMints !== undefined && remainingMints < BigInt(mintQuantity))}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : `🎁 Sponsored Batch Mint (${mintQuantity})`}
            </button>
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
