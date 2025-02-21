"use client";

import dynamic from "next/dynamic";

const WagmiProvider = dynamic(() => import("./WagmiProvider"), {
  ssr: false,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider>{children}</WagmiProvider>;
}
