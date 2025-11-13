"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Sidebar = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const location = useLocation();
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'NFT',
      path: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Games',
      path: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.751 9l.249-.249A5.484 5.484 0 0119.5 9.5a5.484 5.484 0 01-4.5 5.251V15h-1v.751a5.484 5.484 0 01-5.251 4.5 5.484 5.484 0 01-4.5-5.251V15h-1v-.751A5.484 5.484 0 014.5 9.5a5.484 5.484 0 014.5-5.251V5h1v-.751A5.484 5.484 0 0114.5 4.5a5.484 5.484 0 014.5 5.251V10h-1v-.249z" />
        </svg>
      )
    },
    {
      name: 'Prediction',
      path: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    }
  };

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white shadow-lg fixed h-screen flex flex-col mt-16"
    >
      <div className="flex-1">
        <div className="p-6 border-b">
          <a href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-[#8051B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xl font-bold bg-[#DBBDE3]/30 px-2 py-1 rounded-lg text-[#8051B8]">
              Stream Pulse
            </span>
          </a>
          <div className="mt-2 flex items-center gap-2">
       
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ x: 4 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                  text-gray-800 hover:bg-[#DBBDE3]/30 hover:text-[#8051B8] ${location.pathname === item.path ? 'bg-[#DBBDE3]/30 text-[#8051B8]' : ''}`}
              >
                <div className="text-gray-800">
                  {item.icon}
                </div>
                <span>{item.name}</span>
                {item.soon && (
                  <span className="ml-auto text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    Soon
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 mb-12">
        <div className="mb-3 text-sm text-gray-600 flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-[#8051B8]' : 'bg-gray-400'}`}></span>
          <span>{isConnected ? 'Connected to Somnia Testnet' : 'Not Connected'}</span>
        </div>
        
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openConnectModal}
            className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8051B8] to-[#DBBDE3] text-white rounded-lg hover:from-[#6a4399] hover:to-[#c5a5d1] transition-all shadow-md hover:shadow-lg font-medium"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            Connect Wallet
          </motion.button>
        ) : (
          <div className="space-y-2">
            <div className="p-3 bg-[#DBBDE3]/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-[#8051B8] font-medium truncate">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1.5 hover:bg-[#DBBDE3]/50 rounded-lg transition-colors"
                title="Copy address"
              >
                <svg 
                  className="w-4 h-4 text-[#8051B8]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                  />
                </svg>
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => disconnect()}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all font-medium"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Disconnect
            </motion.button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
