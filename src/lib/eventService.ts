import { type Address, type Hex } from 'viem'
import { SDK, zeroBytes32 } from '@somnia-chain/streams'
import { getSDK, getEventSchemaEncoder, getEventSchemaId, generateEventId } from './sdsClient'
import { eventSchema } from './schema'
import { saveEventToStorage, getStoredEventsForPublisher } from './storageService'

export interface EventData {
  timestamp: bigint
  publisher: Address
  eventType: string
  eventData: string
}

export interface PublishedEvent extends EventData {
  id: Hex
  schemaId: Hex
  txHash?: Hex
}

// Publish an event to the blockchain
export async function publishEvent(
  publisher: Address,
  eventType: string,
  eventData: string
): Promise<PublishedEvent | null> {
  try {
    const sdk = await getSDK(true) // Require wallet for publishing
    const encoder = getEventSchemaEncoder()
    
    // Compute schema ID
    const schemaId = await getEventSchemaId()
    if (!schemaId) {
      throw new Error('Failed to compute schema ID')
    }
    
    // Check if schema is registered
    const isRegistered = await sdk.streams.isDataSchemaRegistered(schemaId)
    if (!isRegistered) {
      // Register the schema first
      const registerTx = await sdk.streams.registerDataSchemas([
        {
          id: 'event',
          schema: eventSchema,
          parentSchemaId: zeroBytes32,
        }
      ], true) // Ignore if already registered
      
      if (registerTx) {
        console.log('Schema registered:', registerTx)
      }
    }
    
    // Encode the event data
    const timestamp = BigInt(Date.now())
    const encodedData = encoder.encodeData([
      { name: 'timestamp', value: timestamp.toString(), type: 'uint64' },
      { name: 'publisher', value: publisher, type: 'address' },
      { name: 'eventType', value: eventType, type: 'string' },
      { name: 'eventData', value: eventData, type: 'string' },
    ])
    
    // Generate unique ID
    const id = generateEventId(publisher, timestamp)
    
    // Publish to blockchain
    const txHash = await sdk.streams.set([
      {
        id,
        schemaId,
        data: encodedData,
      }
    ])
    
    if (!txHash) {
      throw new Error('Failed to publish event')
    }
    
    // Ensure txHash is a string (Hex type from viem is already a string, but be safe)
    const txHashStr = typeof txHash === 'string' ? txHash : String(txHash)
    
    const publishedEvent: PublishedEvent = {
      id,
      schemaId,
      timestamp,
      publisher,
      eventType,
      eventData,
      txHash: txHashStr as Hex,
    }
    
    // Save to local storage for immediate UI updates
    saveEventToStorage(publishedEvent)
    
    return publishedEvent
  } catch (error) {
    console.error('Error publishing event:', error)
    return null
  }
}

// Read all events from a publisher (Somnia Testnet only)
// Also includes events from local storage for immediate updates
export async function getAllEvents(publisher: Address): Promise<PublishedEvent[]> {
  // First, get events from local storage for immediate display
  const storedEvents = getStoredEventsForPublisher(publisher)
  
  try {
    const sdk = await getSDK(false) // Don't require wallet for reading
    const schemaId = await getEventSchemaId()
    
    if (!schemaId) {
      console.warn('Schema ID not available, returning stored events only')
      return storedEvents
    }
    
    console.log('Fetching events for publisher:', publisher, 'on testnet with schema:', schemaId)
    const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher)
    console.log('Raw data from SDK:', data)
    
    const encoder = getEventSchemaEncoder()
    const onChainEvents: PublishedEvent[] = []
    
    if (data && Array.isArray(data)) {
      // The SDK automatically decodes data for registered schemas
      // Data structure: Array of arrays, where each inner array contains decoded fields
      for (const item of data) {
        try {
          // Handle decoded data structure from SDK
          if (Array.isArray(item) && item.length >= 4) {
            // Extract values from decoded structure
            const getValue = (field: any) => {
              if (typeof field === 'object' && field !== null) {
                return field.value?.value ?? field.value ?? field
              }
              return field
            }
            
            const timestamp = BigInt(getValue(item[0]) || 0)
            const eventPublisher = getValue(item[1]) || publisher
            const eventType = String(getValue(item[2]) || '')
            const eventDataStr = String(getValue(item[3]) || '')
            
            onChainEvents.push({
              id: generateEventId(eventPublisher, timestamp),
              schemaId,
              timestamp,
              publisher: eventPublisher as Address,
              eventType,
              eventData: eventDataStr,
            })
          } else if (typeof item === 'string' && item.startsWith('0x')) {
            // If we get raw hex, decode it manually
            const decoded = encoder.decode(item as Hex)
            if (decoded && decoded.length >= 4) {
              const timestamp = BigInt(decoded[0]?.value || 0)
              onChainEvents.push({
                id: generateEventId(publisher, timestamp),
                schemaId,
                timestamp,
                publisher: decoded[1]?.value || publisher,
                eventType: String(decoded[2]?.value || ''),
                eventData: String(decoded[3]?.value || ''),
              })
            }
          }
        } catch (err) {
          console.error('Error decoding event:', err, item)
        }
      }
    }
    
    // Merge stored and on-chain events, removing duplicates
    const allEvents = [...storedEvents]
    for (const onChainEvent of onChainEvents) {
      const exists = allEvents.some(
        e => e.id === onChainEvent.id || e.txHash === onChainEvent.txHash
      )
      if (!exists) {
        allEvents.push(onChainEvent)
      }
    }
    
    // Sort by timestamp (newest first)
    return allEvents.sort((a, b) => Number(b.timestamp - a.timestamp))
  } catch (error) {
    console.error('Error reading events from chain, returning stored events:', error)
    // Return stored events as fallback
    return storedEvents
  }
}

// Get latest event from a publisher (Somnia Testnet only)
export async function getLatestEvent(publisher: Address): Promise<PublishedEvent | null> {
  try {
    const sdk = await getSDK(false) // Don't require wallet for reading
    const schemaId = await getEventSchemaId()
    
    if (!schemaId) {
      return null
    }
    
    const data = await sdk.streams.getLastPublishedDataForSchema(schemaId, publisher)
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null
    }
    
    const encoder = getEventSchemaEncoder()
    const item = data[0]
    
    // Handle decoded data structure
    const getValue = (field: any) => {
      if (typeof field === 'object' && field !== null) {
        return field.value?.value ?? field.value ?? field
      }
      return field
    }
    
    let decoded
    if (Array.isArray(item) && item.length >= 4) {
      decoded = item
    } else if (typeof item === 'string' && item.startsWith('0x')) {
      decoded = encoder.decode(item as Hex)
    } else {
      return null
    }
    
    const timestamp = BigInt(getValue(decoded[0]) || 0)
    const eventPublisher = getValue(decoded[1]) || publisher
    
    return {
      id: generateEventId(eventPublisher, timestamp),
      schemaId,
      timestamp,
      publisher: eventPublisher as Address,
      eventType: String(getValue(decoded[2]) || ''),
      eventData: String(getValue(decoded[3]) || ''),
    }
  } catch (error) {
    console.error('Error reading latest event:', error)
    return null
  }
}

