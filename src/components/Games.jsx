import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { publishEvent } from '../lib/eventService';

const Games = () => {
  const { address, isConnected } = useAccount();
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePublishGameEvent = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsPublishing(true);
    setError('');
    setSuccess('');

    try {
      const eventData = JSON.stringify({
        action: 'Game_Action',
        timestamp: new Date().toISOString(),
        description: 'User performed a game action'
      });

      const result = await publishEvent(address, 'Game_Event', eventData);

      if (result) {
        setSuccess(`Game event published! TX: ${result.txHash?.slice(0, 10)}...`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to publish game event. Please try again.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.message || 'Failed to publish game event');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
            Games
          </h1>
          <p className="text-gray-400 text-lg">
            Register game events on Somnia Data Streams
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-[#8051B8]/30"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/40 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.751 9l.249-.249A5.484 5.484 0 0119.5 9.5a5.484 5.484 0 01-4.5 5.251V15h-1v.751a5.484 5.484 0 01-5.251 4.5 5.484 5.484 0 01-4.5-5.251V15h-1v-.751A5.484 5.484 0 014.5 9.5a5.484 5.484 0 014.5-5.251V5h1v-.751A5.484 5.484 0 0114.5 4.5a5.484 5.484 0 014.5 5.251V10h-1v-.249z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Publish Game Event
            </h2>
            <p className="text-gray-400 mb-8">
              Click the button below to instantly register a game event on Somnia Data Streams
            </p>
          </div>

          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
              <p className="text-sm text-yellow-300 text-center">
              Please connect your wallet to publish game events
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-300 text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <p className="text-sm text-green-300 text-center">{success}</p>
            </div>
          )}

          <motion.button
            onClick={handlePublishGameEvent}
            disabled={isPublishing || !isConnected}
            whileHover={{ scale: isConnected && !isPublishing ? 1.02 : 1 }}
            whileTap={{ scale: isConnected && !isPublishing ? 0.98 : 1 }}
            className="w-full px-8 py-6 bg-gradient-to-r from-[#8051B8] to-[#DBBDE3] text-white rounded-lg font-bold text-lg hover:from-[#6a4399] hover:to-[#c5a5d1] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </span>
            ) : (
              '🎮 Publish Game Event'
            )}
          </motion.button>

          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-[#8051B8]/20">
            <p className="text-sm text-gray-400 text-center">
              <span className="font-semibold text-[#8051B8]">Event Type:</span> Game_Event
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              This event will be stored on Somnia Testnet and can be read by any application
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Games;

