import React from 'react';
import { motion } from 'framer-motion';
import PublishEvent from './PublishEvent';
import EventFeed from './EventFeed';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const { address } = useAccount();

  const handleEventPublished = (event) => {
    // Event published, can trigger refresh or notification
    console.log('Event published:', event);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DBBDE3]/10 via-white to-[#DBBDE3]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
            Stream Pulse Dashboard
          </h1>
          <p className="text-gray-600">
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
            <EventFeed />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#DBBDE3]/50">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">0</div>
            <div className="text-gray-600">Total Events</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#DBBDE3]/50">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">
              {address ? '1' : '0'}
            </div>
            <div className="text-gray-600">Connected Wallets</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#DBBDE3]/50">
            <div className="text-3xl font-bold text-[#8051B8] mb-2">Live</div>
            <div className="text-gray-600">Status</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

