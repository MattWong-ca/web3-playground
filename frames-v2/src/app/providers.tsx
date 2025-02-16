'use client';

import dynamic from 'next/dynamic';

const WagmiProvider = dynamic(
  () => import('./component/providers/WagmiProvider'),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider>{children}</WagmiProvider>;
}