import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { publishEvent } from '../lib/eventService';
import { EVENT_TYPES } from '../lib/schema';

const PublishEvent = ({ onEventPublished }) => {
  const { address } = useAccount();
  const [eventType, setEventType] = useState(EVENT_TYPES[0]);
  const [eventData, setEventData] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePublish = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!eventData.trim()) {
      setError('Please enter event data');
      return;
    }

    setIsPublishing(true);
    setError('');
    setSuccess('');

    try {
      const result = await publishEvent(address, eventType, eventData);
      
      if (result && result.txHash) {
        const txHashStr = typeof result.txHash === 'string' ? result.txHash : String(result.txHash);
        const shortHash = txHashStr.length > 10 ? `${txHashStr.slice(0, 10)}...` : txHashStr;
        setSuccess(`Event published! TX: ${shortHash}`);
        setEventData('');
        
        // Notify parent component
        if (onEventPublished) {
          onEventPublished(result);
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to publish event. Please try again.');
      }
    } catch (err) {
      console.error('Publish error:', err);
      setError(err.message || 'Failed to publish event');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-[#8051B8]/30"
    >
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#8051B8] to-[#CDA3E0] bg-clip-text text-transparent">
        Publish Event
      </h2>
      
      {!address && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
          <p className="text-sm text-yellow-300">Please connect your wallet to publish events</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Type
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-4 py-2 border border-[#8051B8]/30 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8051B8]"
            disabled={isPublishing}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Data (JSON string)
          </label>
          <textarea
            value={eventData}
            onChange={(e) => setEventData(e.target.value)}
            placeholder='{"message": "Hello World", "value": 100}'
            rows={4}
            className="w-full px-4 py-2 border border-[#8051B8]/30 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8051B8] resize-none placeholder-gray-500"
            disabled={isPublishing}
          />
          <p className="mt-1 text-xs text-gray-400">
            Enter event data as a JSON string
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
            <p className="text-sm text-green-300">{success}</p>
          </div>
        )}

        <motion.button
          onClick={handlePublish}
          disabled={isPublishing || !address}
          whileHover={{ scale: address && !isPublishing ? 1.02 : 1 }}
          whileTap={{ scale: address && !isPublishing ? 0.98 : 1 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#8051B8] to-[#DBBDE3] text-white rounded-lg font-semibold hover:from-[#6a4399] hover:to-[#c5a5d1] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? 'Publishing...' : 'Publish Event'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PublishEvent;


