"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { SendEvmTransactionButton } from "@coinbase/cdp-react";
import { useIsSignedIn, useEvmAddress } from "@coinbase/cdp-hooks";

function AuthComponent() {
  const { isSignedIn } = useIsSignedIn();

  return (
    <div>
      {isSignedIn ? (
        <div>Welcome! You&apos;re signed in.</div>
      ) : (
        <div>
          <h2>Please sign in</h2>
          <AuthButton />
        </div>
      )}
    </div>
  );
}

function WalletInfo() {
  const { evmAddress } = useEvmAddress();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const network = "base-sepolia"; // Base Sepolia testnet

  useEffect(() => {
    if (!evmAddress) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setLoading(true);
      try {
        // Use public Base Sepolia RPC endpoint to get balance
        const rpcUrl = "https://sepolia.base.org";
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [evmAddress, "latest"],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`RPC error: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.message);
        }

        // Convert from hex wei to ETH (result.result is a hex string like "0x1234")
        const balanceWei = BigInt(result.result);
        const ethBalance = (Number(balanceWei) / 1e18).toFixed(6);
        setBalance(ethBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error loading balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [evmAddress]);

  if (!evmAddress) {
    return <p className="text-zinc-600 dark:text-zinc-400">Wallet not connected</p>;
  }

  return (
    <div className="space-y-2 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50">Wallet Info</h3>
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Address: </span>
          <span className="font-mono text-xs break-all text-zinc-900 dark:text-zinc-100">
            {evmAddress}
          </span>
        </div>
        <div>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Network: </span>
          <span className="text-zinc-900 dark:text-zinc-100">{network}</span>
        </div>
        <div>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Balance: </span>
          {loading ? (
            <span className="text-zinc-600 dark:text-zinc-400">Loading...</span>
          ) : (
            <span className="text-zinc-900 dark:text-zinc-100">
              {balance} ETH
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        <p>💡 Get test ETH from: <a href="https://portal.cdp.coinbase.com/products/faucet" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Base Sepolia Faucet</a></p>
      </div>
    </div>
  );
}

function SendTransaction() {
  const { evmAddress } = useEvmAddress();
  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">Send Transaction</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          This sends 0.000001 ETH (1000000000000 wei) to your own address on Base Sepolia testnet.
        </p>
        {evmAddress ? (
          <SendEvmTransactionButton
            account={evmAddress}
            network="base-sepolia"
            transaction={{
              to: evmAddress,
              value: BigInt("1000000000000"), // 0.000001 ETH
              chainId: 84532, // Base Sepolia
              type: "eip1559",
            }}
            onSuccess={(hash) => {
              console.log('Transaction successful:', hash);
              alert(`Transaction sent! Hash: ${hash}`);
            }}
            onError={(error) => {
              console.error('Transaction failed:', error);
              alert(`Transaction failed: ${error.message}`);
            }}
            pendingLabel="Sending transaction..."
          />
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">Wallet not ready yet...</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Coinbase CDP Wallet Demo
          </h1>
          <div className="w-full flex flex-col gap-6">
            <AuthComponent />
            <WalletInfo />
            <SendTransaction />
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
