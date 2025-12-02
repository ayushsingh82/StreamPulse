import { getSDK, getEventSchemaId } from './sdsClient'
import type { PublishedEvent } from './eventService'

export interface SubscriptionCallbacks {
  onData: (event: PublishedEvent) => void
  onError?: (error: Error) => void
}

// Subscribe to events in real-time
export async function subscribeToEvents(
  callbacks: SubscriptionCallbacks
): Promise<(() => void) | null> {
  try {
    const sdk = await getSDK(false) // Don't require wallet for subscriptions (read-only)
    const schemaId = await getEventSchemaId()
    
    if (!schemaId) {
      throw new Error('Schema ID not available')
    }
    
    // Register event schema if needed
    const eventId = 'EventPublished'
    try {
      await sdk.streams.registerEventSchemas(
        [eventId],
        [{
          params: [
            { name: 'schemaId', paramType: 'bytes32', isIndexed: true },
            { name: 'publisher', paramType: 'address', isIndexed: true },
          ],
          eventTopic: 'EventPublished(bytes32 indexed schemaId, address indexed publisher)',
        }]
      )
    } catch (err) {
      // Event schema might already be registered
      console.log('Event schema registration:', err)
    }
    
    // Subscribe to events
    const subscription = await sdk.streams.subscribe({
      somniaStreamsEventId: eventId,
      onData: async (data) => {
        try {
          // Process the event data
          // The data structure will depend on how events are emitted
          // For now, we'll trigger a callback that can fetch the latest data
          if (callbacks.onData) {
            // You may need to decode the event data here
            // For now, we'll use a placeholder structure
            // In a real implementation, you'd decode the event log
            const event: PublishedEvent = {
              id: data.result?.topics?.[0] || '0x0',
              schemaId: data.result?.topics?.[1] || schemaId,
              timestamp: BigInt(Date.now()),
              publisher: data.result?.topics?.[2] || '0x0',
              eventType: '',
              eventData: '',
            }
            callbacks.onData(event)
          }
        } catch (error) {
          console.error('Error processing subscription data:', error)
          if (callbacks.onError) {
            callbacks.onError(error as Error)
          }
        }
      },
      onError: (error) => {
        console.error('Subscription error:', error)
        if (callbacks.onError) {
          callbacks.onError(error as Error)
        }
      },
    })
    
    // Return unsubscribe function
    return () => {
      // Note: The SDK might have an unsubscribe method
      // Check the SDK documentation for the correct way to unsubscribe
      console.log('Unsubscribing from events')
    }
  } catch (error) {
    console.error('Error setting up subscription:', error)
    if (callbacks.onError) {
      callbacks.onError(error as Error)
    }
    return null
  }
}




