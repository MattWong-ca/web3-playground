"use client";

import { CDPReactProvider } from "@coinbase/cdp-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
  
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT_ID environment variable is required");
  }

  return (
    <CDPReactProvider
      config={{
        projectId,
        ethereum: { // if you want to create an EVM account on login
          createOnLogin: "eoa" // or "smart" for smart accounts
        },
        solana: { // if you want to create a Solana account on login
          createOnLogin: true
        },
        appName: "Your App Name"
      }}
    >
      {children}
    </CDPReactProvider>
  );
}

