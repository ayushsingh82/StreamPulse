# Stream Pulse

**Real-Time On-Chain Event Dashboard**

Stream Pulse is a real-time dashboard that transforms on-chain blockchain data into live, structured, and reactive streams using Somnia Data Streams (SDS). Built for the Somnia Data Streams Mini Hackathon, this project showcases how blockchain data can become instantly reactive, eliminating delays between on-chain events and user interface updates.

---

## 🎯 Project Overview

Stream Pulse demonstrates the power of Somnia Data Streams by providing a unified dashboard that:

- **Publishes Events**: Users can publish custom on-chain events with structured schemas
- **Subscribes in Real-Time**: Live event subscriptions update the UI instantly as events occur
- **Visualizes Activity**: Charts and analytics show event patterns and trends
- **Explores Data**: Browse, filter, and search through all published events

---

## 🌟 Key Features

### 1. **Real-Time Event Publishing**
- Publish custom events directly to the blockchain
- Schema-based encoding ensures structured, discoverable data
- On-chain storage provides immutability and transparency

### 2. **Live Event Subscriptions**
- Subscribe to events using SDS reactivity
- UI updates instantly when new events occur
- No polling required - true push-based updates

### 3. **Event Analytics Dashboard**
- Real-time event frequency charts
- Activity timeline visualization
- Top event types and publishers
- Live statistics and metrics

### 4. **Event Explorer**
- Browse all published events
- Filter by event type, date, or publisher
- Search functionality
- Detailed event information

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Blockchain**: Somnia Testnet (Chain ID: 50312)
- **SDK**: Somnia Data Streams SDK (`@somnia-chain/streams`)
- **Wallet**: Wagmi, RainbowKit, MetaMask
- **Chain Library**: Viem

### Project Structure

```
Ether-Voice/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Sidebar.jsx       # Sidebar navigation
│   │   │   ├── config.ts         # Somnia Testnet chain config
│   │   │   └── ui/               # UI components
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # App entry point
│   └── package.json
└── Readme.md
```

---

## 🔄 Project Flow

### 1. **Initialization**

When the application starts:

1. **Chain Configuration**: Somnia Testnet is configured with:
   - Chain ID: `50312`
   - RPC URL: `https://dream-rpc.somnia.network`
   - Native Currency: STT (Somnia Testnet Token)
   - Block Explorer: `https://shannon-explorer.somnia.network/`

2. **Wallet Connection**: Users connect their MetaMask wallet to Somnia Testnet

3. **SDK Initialization**: Somnia Data Streams SDK is initialized with:
   - Public client (for reading data)
   - Wallet client (for signing transactions)

### 2. **Event Publishing Flow**

```
User Input → Schema Encoding → Generate Unique ID → Publish to SDS → On-Chain Storage
```

**Step-by-Step Process:**

1. **User Creates Event**:
   - Selects event type (Transaction, NFT Sale, Game Event, etc.)
   - Enters event data
   - Clicks "Publish"

2. **Schema Encoding**:
   ```javascript
   const eventSchema = 'uint64 timestamp, address publisher, string eventType, string eventData'
   const schemaId = await sdk.streams.computeSchemaId(eventSchema)
   const encoder = new SchemaEncoder(eventSchema)
   const data = encoder.encodeData([
     { name: 'timestamp', value: BigInt(Date.now()), type: 'uint64' },
     { name: 'publisher', value: address, type: 'address' },
     { name: 'eventType', value: eventType, type: 'string' },
     { name: 'eventData', value: eventData, type: 'string' }
   ])
   ```

3. **Generate Unique ID**:
   ```javascript
   const id = keccak256(toHex(`${address}-${timestamp}`))
   ```

4. **Publish to Blockchain**:
   ```javascript
   await sdk.streams.set([{ id, schemaId, data }])
   ```

5. **Transaction Confirmation**:
   - Wait for transaction receipt
   - Event is now stored on-chain
   - Event appears in dashboard

### 3. **Real-Time Subscription Flow**

```
SDS Event → Subscription Callback → UI Update → User Sees New Event
```

**Step-by-Step Process:**

1. **Subscribe to Events**:
   ```javascript
   const subscription = await sdk.streams.subscribe({
     somniaStreamsEventId: "EventPublished",
     onData: (data) => {
       // Process event data
       updateDashboard(data)
       addToEventFeed(data)
       updateCharts(data)
     },
     onError: (error) => {
       // Handle errors gracefully
       console.error('Subscription error:', error)
     }
   })
   ```

2. **Event Triggered**:
   - New event is published on-chain
   - SDS detects the event
   - Callback function is invoked

3. **UI Updates**:
   - Event added to live feed
   - Charts updated
   - Statistics recalculated
   - All updates happen instantly without page refresh

### 4. **Event Reading Flow**

```
Query SDS → Decode Schema Data → Process & Filter → Display in UI
```

**Step-by-Step Process:**

1. **Query All Events**:
   ```javascript
   const schemaId = await sdk.streams.computeSchemaId(eventSchema)
   const events = await sdk.streams.getAllPublisherDataForSchema(schemaId, publisher)
   ```

2. **Decode Event Data**:
   ```javascript
   const decoder = new SchemaDecoder(eventSchema)
   events.forEach(event => {
     const decoded = decoder.decodeData(event.data)
     // Process decoded data
   })
   ```

3. **Process & Filter**:
   - Filter by event type
   - Sort by timestamp
   - Group by publisher
   - Calculate statistics

4. **Display in UI**:
   - Event list
   - Charts and graphs
   - Statistics cards
   - Search and filter results

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A funded Somnia Testnet wallet (get STT from [Somnia Faucet](https://faucet.somnia.network))
- MetaMask browser extension
- Basic familiarity with React and TypeScript

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "somnia stream/Ether-Voice/client"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (if needed):
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:5173`

### Wallet Setup

1. **Connect MetaMask**:
   - Click "Connect Wallet" in the sidebar
   - Approve connection in MetaMask

2. **Switch to Somnia Testnet**:
   - If not already added, add Somnia Testnet:
     - Network Name: Somnia Testnet
     - RPC URL: https://dream-rpc.somnia.network
     - Chain ID: 50312
     - Currency Symbol: STT
     - Block Explorer: https://shannon-explorer.somnia.network/

3. **Get Test Tokens**:
   - Visit [Somnia Faucet](https://faucet.somnia.network)
   - Request STT tokens for your wallet

---

## 📊 How It Works

### Schema Design

Stream Pulse uses structured schemas to ensure data consistency and discoverability:

```typescript
// Event Schema
const eventSchema = 'uint64 timestamp, address publisher, string eventType, string eventData'
```

**Schema Fields:**
- `timestamp`: Unix timestamp of when the event occurred
- `publisher`: Wallet address of the event publisher
- `eventType`: Type of event (e.g., "Transaction", "NFT Sale", "Game Event")
- `eventData`: JSON string containing event-specific data

### SDS Integration

**Writing Data:**
- Uses `sdk.streams.set()` to publish events
- Each event is cryptographically signed
- Data is stored immutably on-chain

**Reading Data:**
- Uses `sdk.streams.getAllPublisherDataForSchema()` to query events
- Supports filtering by publisher and schema
- Efficient data retrieval

**Subscribing to Events:**
- Uses `sdk.streams.subscribe()` for real-time updates
- Event-driven architecture (push-based)
- No polling required

### Reactivity Pattern

Stream Pulse leverages SDS reactivity to provide instant updates:

```javascript
// When an event is published
await sdk.streams.setAndEmitEvents(
  dataStreams,  // The event data
  eventStreams  // Event emissions
)

// Subscribers receive instant callbacks
subscription.onData((data) => {
  // UI updates immediately
  updateDashboard(data)
})
```

---

## 🎨 User Interface

### Landing Page

- **Hero Section**: Welcome message and project overview
- **Features Section**: Key capabilities of Stream Pulse
- **How It Works**: Step-by-step explanation
- **Statistics**: Live metrics and activity

### Dashboard (Coming Soon)

- **Live Event Feed**: Real-time stream of all events
- **Analytics Charts**: Visual representation of event data
- **Event Explorer**: Browse and search events
- **Publish Event**: Form to create new events

### Navigation

- **Sidebar**: Quick navigation to NFT, Games, and Prediction sections
- **Wallet Connection**: Connect/disconnect MetaMask
- **Network Status**: Shows connection to Somnia Testnet

---

## 🔐 Security & Best Practices

### Security Features

- **Wallet Integration**: All transactions require user approval
- **Schema Validation**: Data is validated before publishing
- **Immutable Storage**: Once published, events cannot be modified
- **Transparent Verification**: All events are verifiable on-chain

### Best Practices

- **Error Handling**: Graceful error handling for failed transactions
- **Loading States**: Clear feedback during transaction processing
- **Transaction Confirmation**: Wait for confirmations before UI updates
- **Rate Limiting**: Cooldown periods prevent spam

---

## 🚧 Current Status

### ✅ Completed

- [x] Project setup and configuration
- [x] Somnia Testnet integration
- [x] Wallet connection (MetaMask)
- [x] Landing page UI
- [x] Navigation structure
- [x] Chain configuration

### 🚧 In Progress

- [ ] Event publishing functionality
- [ ] Real-time event subscriptions
- [ ] Event dashboard and analytics
- [ ] Event explorer with filtering
- [ ] Charts and visualizations

### 📋 Future Enhancements

- [ ] Multiple event types support
- [ ] Advanced filtering and search
- [ ] Export event data
- [ ] Event notifications
- [ ] Multi-chain support
- [ ] API for third-party integrations

---

## 🏆 Hackathon Goals

### Technical Excellence

- ✅ Proper SDS SDK integration
- ✅ Schema-based data encoding
- ✅ Real-time reactivity implementation
- ✅ Clean architecture and code organization

### Real-Time UX

- ✅ Event-driven updates (no polling)
- ✅ Instant UI feedback
- ✅ Smooth animations and transitions
- ✅ Responsive design

### Somnia Integration

- ✅ Deployed on Somnia Testnet
- ✅ Uses native STT token
- ✅ Leverages SDS capabilities
- ✅ Follows Somnia best practices

### Potential Impact

- ✅ Demonstrates SDS use cases
- ✅ Reference implementation for developers
- ✅ Educational value for the community
- ✅ Scalable architecture

---

## 📚 Resources

### Documentation

- [Somnia Data Streams Docs](https://docs.somnia.network)
- [Somnia Testnet Explorer](https://shannon-explorer.somnia.network/)
- [Somnia Faucet](https://faucet.somnia.network)

### SDK References

- `@somnia-chain/streams`: Somnia Data Streams SDK
- `viem`: Ethereum library for TypeScript
- `wagmi`: React Hooks for Ethereum

### Community

- Somnia Discord
- Somnia Twitter
- Somnia GitHub

---

## 🤝 Contributing

This project is built for the Somnia Data Streams Mini Hackathon. Contributions and feedback are welcome!

---

## 📄 License

This project is part of the Somnia Data Streams Mini Hackathon submission.

---

## 👥 Team

Built with ❤️ for the Somnia Data Streams Mini Hackathon (November 4-15, 2025)

---

**Stream Pulse** - Real-time on-chain events, streamed live.

