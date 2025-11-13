import { SDK, SchemaEncoder } from '@somnia-chain/streams'
import { createPublicClient, createWalletClient, http, custom, type Address, type Hex } from 'viem'
import { somniaTestnet } from '../components/config'
import { eventSchema } from './schema'

// Get public client for reading data
export function getPublicClient() {
  if (typeof window === 'undefined') return null
  
  return createPublicClient({
    chain: somniaTestnet,
    transport: http('https://dream-rpc.somnia.network'),
  })
}

// Get wallet client for writing data (requires MetaMask)
export function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) return null
  
  return createWalletClient({
    chain: somniaTestnet,
    transport: custom(window.ethereum),
  })
}

// Initialize SDK instance
export function getSDK() {
  const publicClient = getPublicClient()
  const walletClient = getWalletClient()
  
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
export async function getEventSchemaId(): Promise<Hex | null> {
  try {
    const sdk = getSDK()
    return await sdk.streams.computeSchemaId(eventSchema)
  } catch (error) {
    console.error('Error computing schema ID:', error)
    return null
  }
}

// Generate unique data ID
export function generateEventId(publisher: Address, timestamp: bigint): Hex {
  const { keccak256, toHex } = require('viem')
  return keccak256(toHex(`${publisher}-${timestamp}`, { size: 32 }))
}

