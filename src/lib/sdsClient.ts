import { SDK, SchemaEncoder } from '@somnia-chain/streams'
import { createPublicClient, createWalletClient, http, custom, keccak256, stringToBytes, type Address, type Hex } from 'viem'
import { somniaTestnet } from '../components/config'
import { eventSchema } from './schema'

// Get public client for reading data (Somnia Testnet only)
export function getPublicClient() {
  if (typeof window === 'undefined') return null
  
  return createPublicClient({
    chain: somniaTestnet,
    transport: http('https://dream-rpc.somnia.network'),
  })
}

// Get wallet client for writing data (requires MetaMask, Somnia Testnet only)
export async function getWalletClient() {
  if (typeof window === 'undefined' || !(window as any).ethereum) return null
  
  const client = createWalletClient({
    chain: somniaTestnet,
    transport: custom((window as any).ethereum),
  })
  
  // Get accounts to ensure wallet is connected
  try {
    const accounts = await client.getAddresses()
    if (!accounts || accounts.length === 0) {
      return null // Return null if no accounts, let caller handle it
    }
  } catch (error) {
    console.warn('Could not get wallet accounts:', error)
    return null
  }
  
  return client
}

// Initialize SDK instance (Somnia Testnet only)
// Requires wallet for write operations, optional for read operations
export async function getSDK(requireWallet: boolean = true) {
  const publicClient = getPublicClient()
  
  if (!publicClient) {
    throw new Error('Public client not available')
  }
  
  const walletClient = await getWalletClient()
  
  if (requireWallet && !walletClient) {
    throw new Error('Wallet client not available. Please connect your wallet.')
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

// Compute schema ID (Somnia Testnet only)
export async function getEventSchemaId(): Promise<Hex | null> {
  try {
    const sdk = await getSDK(false) // Don't require wallet for computing schema ID
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
  const data = stringToBytes(`${publisher}-${timestamp.toString()}`)
  return keccak256(data)
}

