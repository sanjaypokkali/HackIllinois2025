import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
// import CanvasPage from './components/pages/CanvasPage';
// import MerchStorePage from './components/pages/MerchStorePage';
// import NFTGalleryPage from './pages/NFTGalleryPage';
// import ProfilePage from './pages/ProfilePage';
import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/canvas/:eventId" element={<CanvasPage />} />
        <Route path="/merch/:nftId" element={<MerchStorePage />} /> */}
        {/* <Route path="/gallery" element={<NFTGalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
