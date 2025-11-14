import { defineChain } from 'viem'

// Define Somnia Testnet chain (matching viem/chains definition)
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Testnet Explorer',
      url: 'https://shannon-explorer.somnia.network/',
      apiUrl: 'https://shannon-explorer.somnia.network/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0x841b8199E6d3Db3C6f264f6C2bd8848b3cA64223',
      blockCreated: 71314235,
    },
  },
  testnet: true,
})

// Define Somnia Mainnet chain
export const somniaMainnet = defineChain({
  id: 1946,
  name: 'Somnia Mainnet',
  nativeCurrency: { name: 'SOM', symbol: 'SOM', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network/',
      apiUrl: 'https://explorer.somnia.network/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
  testnet: false,
})