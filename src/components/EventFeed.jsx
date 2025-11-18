import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { getAllEvents } from '../lib/eventService';
import { subscribeToEvents } from '../lib/subscriptionService';
import { isAddress } from 'viem';

const EventFeed = () => {
  const { address: connectedAddress } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill connected wallet address
  useEffect(() => {
    if (connectedAddress && !walletAddress) {
      setWalletAddress(connectedAddress);
    }
  }, [connectedAddress]);

  // Load events when wallet address changes
  useEffect(() => {
    if (walletAddress && isAddress(walletAddress)) {
      loadEvents();
    } else {
      setEvents([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const loadEvents = async () => {
    if (!walletAddress || !isAddress(walletAddress)) {
      setEvents([]);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading events for:', walletAddress, 'on testnet');
      const allEvents = await getAllEvents(walletAddress);
      console.log('Loaded events:', allEvents);
      setEvents(allEvents);
      
      if (allEvents.length === 0) {
        setError('No events found for this wallet address. Make sure the address has published events on Somnia Testnet.');
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError(`Failed to load events: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setWalletAddress(value);
    setError('');
  };

  const handleUseConnected = () => {
    if (connectedAddress) {
      setWalletAddress(connectedAddress);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString();
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getExplorerUrl = (txHash) => {
    return `https://shannon-explorer.somnia.network/tx/${txHash}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-[#8051B8]/30"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
          Activity Tracker
        </h2>
        <button
          onClick={loadEvents}
          disabled={loading || !walletAddress || !isAddress(walletAddress)}
          className="px-4 py-2 text-sm bg-gray-800 text-[#8051B8] rounded-lg hover:bg-gray-700 border border-[#8051B8]/30 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Wallet Address Input */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Wallet Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={walletAddress}
              onChange={handleAddressChange}
              placeholder="0x..."
              className="flex-1 px-4 py-2 border border-[#8051B8]/30 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8051B8] focus:border-transparent placeholder-gray-500"
            />
            {connectedAddress && (
              <button
                onClick={handleUseConnected}
                className="px-4 py-2 text-sm bg-[#8051B8] text-white rounded-lg hover:bg-[#6a4399] transition-colors"
              >
                Use Connected
              </button>
            )}
          </div>
          {walletAddress && !isAddress(walletAddress) && (
            <p className="mt-1 text-xs text-red-400">Invalid wallet address</p>
          )}
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          <p>🌐 Network: <span className="text-[#8051B8] font-semibold">Somnia Testnet</span></p>
          <p className="mt-1">📝 SDS Contract: <span className="font-mono text-xs">0x6AB397FF662e42312c003175DCD76EfF69D048Fc</span></p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
          {/* Discovery Section */}
          <div className="mt-3 pt-3 border-t border-red-500/30">
            <p className="text-xs font-semibold text-red-300 mb-2">💡 Need addresses with activity?</p>
            <div className="space-y-2 text-xs text-red-400">
              <div>
                <p className="font-medium mb-1">1. Browse Block Explorer:</p>
                <a
                  href="https://shannon-explorer.somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8051B8] hover:underline inline-flex items-center gap-1"
                >
                  Open Testnet Explorer
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="mt-1 text-red-400">Look for transactions to the Data Streams contract and copy the "From" address</p>
              </div>
              <div>
                <p className="font-medium mb-1">2. Publish Your Own Event:</p>
                <p className="text-red-400">Use the "Publish Event" section on the left to create your first event, then track your own address!</p>
              </div>
              <div>
                <p className="font-medium mb-1">3. Check Recent Transactions:</p>
                <p className="text-red-400">In the explorer, filter by contract interactions and look for addresses that have interacted with stream contracts</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8051B8]"></div>
          <p className="mt-2 text-gray-400">Loading events...</p>
        </div>
      ) : !walletAddress || !isAddress(walletAddress) ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Enter a wallet address to track activity</p>
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-[#8051B8]/30">
            <p className="text-sm font-semibold text-gray-300 mb-2">🔍 How to Find Active Addresses:</p>
            <div className="text-left space-y-2 text-xs text-gray-400">
              <div>
                <p className="font-medium">1. Block Explorer:</p>
                <a
                  href="https://shannon-explorer.somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8051B8] hover:underline inline-flex items-center gap-1"
                >
                  Browse Testnet Transactions
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div>
                <p className="font-medium">2. Publish Your Own:</p>
                <p>Use the "Publish Event" section to create events with your connected wallet</p>
              </div>
            </div>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No events found for this wallet</p>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            This address hasn't published any events on Somnia Testnet yet
          </p>
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-[#8051B8]/30 text-left">
            <p className="text-sm font-semibold text-gray-300 mb-2">💡 Find Active Addresses:</p>
            <div className="space-y-2 text-xs text-gray-400">
              <div>
                <p className="font-medium">Browse Block Explorer:</p>
                <a
                  href="https://shannon-explorer.somnia.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8051B8] hover:underline inline-flex items-center gap-1"
                >
                  Open Testnet Explorer
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="mt-1">• Look for transactions to Data Streams contracts</p>
                <p>• Copy the "From" address from recent transactions</p>
                <p>• Paste it above to view their activity</p>
              </div>
              <div className="pt-2 border-t border-[#DBBDE3]/30">
                <p className="font-medium">Or publish your own event:</p>
                <p>Use the "Publish Event" section to create your first event!</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <div className="text-sm text-gray-400 mb-2">
            Found {events.length} event{events.length !== 1 ? 's' : ''} on Somnia Testnet
          </div>
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={`${event.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-800/50 rounded-lg border border-[#8051B8]/30 hover:border-[#8051B8]/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-[#8051B8] text-white rounded">
                      {event.eventType}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  {event.txHash && (
                    <a
                      href={getExplorerUrl(event.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#8051B8] hover:underline"
                    >
                      View TX
                    </a>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-300 font-mono break-all">
                    {event.eventData}
                  </p>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Publisher: {formatAddress(event.publisher)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default EventFeed;

