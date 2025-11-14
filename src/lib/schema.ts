// Event Schema Definition
export const eventSchema = 'uint64 timestamp, address publisher, string eventType, string eventData'

// Event Types
export const EVENT_TYPES = [
  'Transaction',
  'NFT Sale',
  'NFT Mint',
  'Game Event',
  'DeFi Event',
  'Governance',
  'Custom'
] as const

export type EventType = typeof EVENT_TYPES[number]


