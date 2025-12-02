import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { publishEvent } from '../lib/eventService';

const NFT = () => {
  const { address, isConnected } = useAccount();
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePublishNFTEvent = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsPublishing(true);
    setError('');
    setSuccess('');

    try {
      const eventData = JSON.stringify({
        action: 'NFT_Interaction',
        timestamp: new Date().toISOString(),
        description: 'User interacted with NFT marketplace'
      });

      const result = await publishEvent(address, 'NFT_Sale', eventData);

      if (result && result.txHash) {
        const txHashStr = typeof result.txHash === 'string' ? result.txHash : String(result.txHash);
        const shortHash = txHashStr.length > 10 ? `${txHashStr.slice(0, 10)}...` : txHashStr;
        setSuccess(`NFT event published! TX: ${shortHash}`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to publish NFT event. Please try again.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.message || 'Failed to publish NFT event');
    } finally {
      setIsPublishing(false);
    }
  };

  const eventPreview = {
    eventType: 'NFT_Sale',
    vision: 'Publish and register NFT-related data schemas on Somnia Data Streams. Verify NFT marketplace streams and monitor all NFT activity through the dashboard.',
    description: 'This platform enables users to publish and register custom data schemas specifically designed for NFT marketplace use cases. Users can define schemas for NFT sales, transfers, listings, bids, and other marketplace interactions. Once registered, these schemas create structured data streams on Somnia Data Streams that can be verified for authenticity and integrity. The dashboard provides comprehensive monitoring capabilities, allowing users to check all published NFT streams, verify their on-chain status, track publisher addresses, and view real-time NFT marketplace activity. This creates a transparent, auditable system where NFT marketplace data is structured, verifiable, and accessible through a unified interface.',
    data: {
      action: 'NFT_Interaction',
      timestamp: new Date().toISOString(),
      description: 'User interacted with NFT marketplace'
    },
    publisher: address || '0x...',
    network: 'Somnia Testnet'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
            NFT Marketplace
          </h1>
          <p className="text-gray-400 text-lg">
            Register NFT sale and interaction events on Somnia Data Streams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Event Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-[#8051B8]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/40 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-200">Event Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Event Type</p>
                <p className="text-lg font-semibold text-[#8051B8]">{eventPreview.eventType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Vision</p>
                <p className="text-gray-200 font-medium">{eventPreview.vision}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-300 leading-relaxed">{eventPreview.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Use Cases</p>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Track NFT sales and transfers</li>
                  <li>• Monitor marketplace activity</li>
                  <li>• Build NFT analytics dashboards</li>
                  <li>• Create real-time NFT feeds</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Event Data Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-[#8051B8]/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/40 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-200">Event Data Preview</h2>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-[#8051B8]/20">
                <p className="text-xs text-gray-400 mb-2">Event Data (JSON)</p>
                <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
                  {JSON.stringify(eventPreview.data, null, 2)}
                </pre>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Publisher:</span>
                <span className="text-[#8051B8] font-mono">
                  {eventPreview.publisher && eventPreview.publisher.length > 10 
                    ? `${eventPreview.publisher.slice(0, 8)}...${eventPreview.publisher.slice(-6)}`
                    : eventPreview.publisher || 'Not connected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Network:</span>
                <span className="text-gray-300">{eventPreview.network}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Publish Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl p-8 shadow-lg border border-[#8051B8]/30"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/40 rounded-lg flex items-center justify-center">
              <svg className="w-12 h-12 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Publish NFT Event to Blockchain
            </h2>
            <p className="text-gray-400 mb-2">
              This will create a permanent record on Somnia Testnet
            </p>
            <p className="text-sm text-gray-500">
              The event will be stored on-chain and can be read by any application using Somnia Data Streams
            </p>
          </div>

          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
              <p className="text-sm text-yellow-300 text-center">
              Please connect your wallet to publish NFT events
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
            onClick={handlePublishNFTEvent}
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
              '🚀 Publish NFT Event'
            )}
          </motion.button>

          {success && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold text-green-300">Event Published Successfully!</p>
              </div>
              <p className="text-sm text-green-400">{success}</p>
              <p className="text-xs text-green-500 mt-2">View your event in the Dashboard's Activity Tracker</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NFT;

