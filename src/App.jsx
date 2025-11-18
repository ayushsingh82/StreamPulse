import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import NFT from './components/NFT';
import Games from './components/Games';
import Prediction from './components/Prediction';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex bg-black">
        <Sidebar />
        <main className="flex-1 ml-64 bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nft" element={<NFT />} />
            <Route path="/games" element={<Games />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
