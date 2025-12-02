import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PublishEvent from './PublishEvent';
import EventFeed from './EventFeed';
import { useAccount } from 'wagmi';
import { getAllEvents } from '../lib/eventService';
import { getStoredEventCount, getStoredEventsForPublisher } from '../lib/storageService';

const Dashboard = () => {
  const { address } = useAccount();
  const [totalEvents, setTotalEvents] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventPublished = (event) => {
    // Event published, refresh event count and feed
    console.log('Event published:', event);
    // Immediately update count from local storage
    if (address) {
      const storedCount = getStoredEventsForPublisher(address).length;
      setTotalEvents(storedCount);
      loadEventCount(); // Also try to load from chain
      // Trigger EventFeed refresh
      setRefreshKey(prev => prev + 1);
    } else {
      // Update global count
      setTotalEvents(getStoredEventCount());
    }
  };

  const loadEventCount = async () => {
    if (!address) {
      // Show global count if no address
      setTotalEvents(getStoredEventCount());
      return;
    }
    
    try {
      // Get events from both local storage and Somnia Testnet
      const events = await getAllEvents(address);
      setTotalEvents(events.length);
    } catch (error) {
      console.error('Error loading event count:', error);
      // Fallback to local storage
      const storedCount = getStoredEventsForPublisher(address).length;
      setTotalEvents(storedCount);
    }
  };

  useEffect(() => {
    loadEventCount();
    
    // Listen for storage changes (when events are published)
    const handleStorageChange = () => {
      loadEventCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom storage events (same-tab updates)
    window.addEventListener('customStorageUpdate', handleStorageChange);
    
    // Refresh count every 5 seconds
    const interval = setInterval(loadEventCount, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorageUpdate', handleStorageChange);
      clearInterval(interval);
    };
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
            Stream Pulse Dashboard
          </h1>
          <p className="text-gray-400">
            Publish and monitor real-time on-chain events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Publish Event Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PublishEvent onEventPublished={handleEventPublished} />
          </motion.div>

          {/* Event Feed Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EventFeed key={refreshKey} />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-[#8051B8]/30">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">{totalEvents}</div>
            <div className="text-gray-400">Total Events</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-[#8051B8]/30">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">
              {address ? '1' : '0'}
            </div>
            <div className="text-gray-400">Connected Wallets</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-[#8051B8]/30">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">Live</div>
            <div className="text-gray-400">Status</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

