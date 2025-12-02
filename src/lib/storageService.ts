import type { PublishedEvent } from './eventService'

const STORAGE_KEY = 'stream_pulse_events'

// Helper to serialize BigInt for JSON
function serializeEvent(event: PublishedEvent): any {
  return {
    ...event,
    timestamp: event.timestamp.toString(), // Convert BigInt to string
  }
}

// Helper to deserialize BigInt from JSON
function deserializeEvent(data: any): PublishedEvent {
  return {
    ...data,
    timestamp: BigInt(data.timestamp || '0'), // Convert string back to BigInt
  }
}

// Get all events from local storage
export function getStoredEvents(): PublishedEvent[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Convert array of serialized events back to PublishedEvent format
    return Array.isArray(parsed) ? parsed.map(deserializeEvent) : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

// Save an event to local storage
export function saveEventToStorage(event: PublishedEvent): void {
  if (typeof window === 'undefined') return
  
  try {
    const events = getStoredEvents()
    // Check if event already exists (by id or txHash)
    const exists = events.some(
      e => e.id === event.id || e.txHash === event.txHash
    )
    
    if (!exists) {
      events.unshift(event) // Add to beginning
      // Keep only last 1000 events to avoid storage bloat
      const limited = events.slice(0, 1000)
      // Serialize events (convert BigInt to string) before storing
      const serialized = limited.map(serializeEvent)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('customStorageUpdate'))
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Get event count from local storage
export function getStoredEventCount(): number {
  return getStoredEvents().length
}

// Get events for a specific publisher from local storage
export function getStoredEventsForPublisher(publisher: string): PublishedEvent[] {
  const events = getStoredEvents()
  return events.filter(e => 
    e.publisher.toLowerCase() === publisher.toLowerCase()
  )
}

// Clear all stored events (for testing)
export function clearStoredEvents(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

