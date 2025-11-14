import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { getAllEvents } from '../lib/eventService';
import { subscribeToEvents } from '../lib/subscriptionService';
import { isAddress } from 'viem';

const EventFeed = () => {
  const { address: connectedAddress } = useAccount();
  const [walletAddress, setWalletAddress] = useState('');
  const [chain, setChain] = useState('testnet'); // 'testnet' or 'mainnet'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill connected wallet address
  useEffect(() => {
    if (connectedAddress && !walletAddress) {
      setWalletAddress(connectedAddress);
    }
  }, [connectedAddress]);

  // Load events when wallet address or chain changes
  useEffect(() => {
    if (walletAddress && isAddress(walletAddress)) {
      loadEvents();
    } else {
      setEvents([]);
    }
  }, [walletAddress, chain]);

  const loadEvents = async () => {
    if (!walletAddress || !isAddress(walletAddress)) {
      setEvents([]);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading events for:', walletAddress, 'on', chain);
      const allEvents = await getAllEvents(walletAddress, chain);
      console.log('Loaded events:', allEvents);
      setEvents(allEvents);
      
      if (allEvents.length === 0) {
        setError('No events found for this wallet address. Make sure the address has published events on ' + chain + '.');
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
    if (chain === 'mainnet') {
      return `https://explorer.somnia.network/tx/${txHash}`;
    }
    return `https://shannon-explorer.somnia.network/tx/${txHash}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-[#DBBDE3]/50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
          Event Feed
        </h2>
        <button
          onClick={loadEvents}
          disabled={loading}
          className="px-4 py-2 text-sm bg-[#DBBDE3]/30 text-[#8051B8] rounded-lg hover:bg-[#DBBDE3]/50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8051B8]"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No events published yet</p>
          <p className="text-sm text-gray-500 mt-2">Publish your first event to see it here!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={`${event.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-[#DBBDE3]/10 rounded-lg border border-[#DBBDE3]/30 hover:border-[#8051B8]/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-[#8051B8] text-white rounded">
                      {event.eventType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  {event.txHash && (
                    <a
                      href={`https://shannon-explorer.somnia.network/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#8051B8] hover:underline"
                    >
                      View TX
                    </a>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700 font-mono break-all">
                    {event.eventData}
                  </p>
                </div>
                <div className="mt-2 text-xs text-gray-500">
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

