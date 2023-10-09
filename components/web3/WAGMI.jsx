import React, { useState, useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { configureChains } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { base } from 'wagmi/chains'

const projectId = '828af0d9067eea0e2fb7773e64ade3a1'

const metadata = {
  name: 'Based Fellas',
  description: 'Based Fellas NFT',
  url: 'https://basedfellas.io',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const { chains } = configureChains(
  [base],
  [alchemyProvider({ apiKey: 'XbT3mXfmaGqexeuRqN6W8xAoLGwgs7Is' })],
)
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

const WAGMI = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      {mounted && children}
    </WagmiConfig>
  );
}

export default WAGMI;
