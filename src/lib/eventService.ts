import { type Address, type Hex } from 'viem'
import { SDK, zeroBytes32 } from '@somnia-chain/streams'
import { getSDK, getEventSchemaEncoder, getEventSchemaId, generateEventId } from './sdsClient'
import { eventSchema } from './schema'

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
    const sdk = getSDK()
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
    
    return {
      id,
      schemaId,
      timestamp,
      publisher,
      eventType,
      eventData,
      txHash,
    }
  } catch (error) {
    console.error('Error publishing event:', error)
    return null
  }
}

// Read all events from a publisher
export async function getAllEvents(publisher: Address): Promise<PublishedEvent[]> {
  try {
    const sdk = getSDK()
    const schemaId = await getEventSchemaId()
    
    if (!schemaId) {
      return []
    }
    
    const data = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher)
    
    if (!data || !Array.isArray(data)) {
      return []
    }
    
    const encoder = getEventSchemaEncoder()
    const events: PublishedEvent[] = []
    
    // Note: The SDK should decode automatically for registered schemas
    // But we'll handle both cases
    for (const item of data) {
      try {
        // If it's already decoded, use it directly
        if (Array.isArray(item) && item.length > 0) {
          const decoded = item as any[]
          events.push({
            id: decoded[0]?.value || '0x0',
            schemaId,
            timestamp: BigInt(decoded[0]?.value || 0),
            publisher: decoded[1]?.value || publisher,
            eventType: decoded[2]?.value || '',
            eventData: decoded[3]?.value || '',
          })
        } else {
          // If raw hex, decode it
          const decoded = encoder.decode(item as Hex)
          events.push({
            id: generateEventId(publisher, decoded[0]?.value || BigInt(0)),
            schemaId,
            timestamp: decoded[0]?.value || BigInt(0),
            publisher: decoded[1]?.value || publisher,
            eventType: decoded[2]?.value || '',
            eventData: decoded[3]?.value || '',
          })
        }
      } catch (err) {
        console.error('Error decoding event:', err)
      }
    }
    
    // Sort by timestamp (newest first)
    return events.sort((a, b) => Number(b.timestamp - a.timestamp))
  } catch (error) {
    console.error('Error reading events:', error)
    return []
  }
}

// Get latest event from a publisher
export async function getLatestEvent(publisher: Address): Promise<PublishedEvent | null> {
  try {
    const sdk = getSDK()
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
    
    // Decode the data
    const decoded = Array.isArray(item) && typeof item[0] === 'object'
      ? item
      : encoder.decode(item as Hex)
    
    return {
      id: generateEventId(publisher, decoded[0]?.value || BigInt(0)),
      schemaId,
      timestamp: decoded[0]?.value || BigInt(0),
      publisher: decoded[1]?.value || publisher,
      eventType: decoded[2]?.value || '',
      eventData: decoded[3]?.value || '',
    }
  } catch (error) {
    console.error('Error reading latest event:', error)
    return null
  }
}

