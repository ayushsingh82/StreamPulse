import { SDK, SchemaEncoder } from '@somnia-chain/streams'
import { createPublicClient, createWalletClient, http, custom, keccak256, toHex, type Address, type Hex } from 'viem'
import { somniaTestnet, somniaMainnet } from '../components/config'
import { eventSchema } from './schema'

// Get public client for reading data
export function getPublicClient(chain: 'testnet' | 'mainnet' = 'testnet') {
  if (typeof window === 'undefined') return null
  
  const selectedChain = chain === 'mainnet' ? somniaMainnet : somniaTestnet
  const rpcUrl = chain === 'mainnet' 
    ? 'https://rpc.somnia.network'
    : 'https://dream-rpc.somnia.network'
  
  return createPublicClient({
    chain: selectedChain,
    transport: http(rpcUrl),
  })
}

// Get wallet client for writing data (requires MetaMask)
export function getWalletClient(chain: 'testnet' | 'mainnet' = 'testnet') {
  if (typeof window === 'undefined' || !(window as any).ethereum) return null
  
  const selectedChain = chain === 'mainnet' ? somniaMainnet : somniaTestnet
  
  return createWalletClient({
    chain: selectedChain,
    transport: custom((window as any).ethereum),
  })
}

// Initialize SDK instance
export function getSDK(chain: 'testnet' | 'mainnet' = 'testnet') {
  const publicClient = getPublicClient(chain)
  const walletClient = getWalletClient(chain)
  
  if (!publicClient) {
    throw new Error('Public client not available')
  }
  
  return new SDK({
    public: publicClient,
    wallet: walletClient || undefined,
  })
}

// Get schema encoder for event schema
export function getEventSchemaEncoder() {
  return new SchemaEncoder(eventSchema)
}

// Compute schema ID
export async function getEventSchemaId(chain: 'testnet' | 'mainnet' = 'testnet'): Promise<Hex | null> {
  try {
    const sdk = getSDK(chain)
    const result = await sdk.streams.computeSchemaId(eventSchema)
    if (result instanceof Error) {
      console.error('Error computing schema ID:', result)
      return null
    }
    return result as Hex
  } catch (error) {
    console.error('Error computing schema ID:', error)
    return null
  }
}

// Generate unique data ID
export function generateEventId(publisher: Address, timestamp: bigint): Hex {
  return keccak256(toHex(`${publisher}-${timestamp}`, { size: 32 }))
}

