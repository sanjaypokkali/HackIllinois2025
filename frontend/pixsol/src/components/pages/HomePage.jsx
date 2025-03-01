import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layout/Layout';
import WalletConnect from '../auth/WalletConnect';
import NFTGallery from '../nft/NFTGallery';
import { getActiveEvents } from '../services/canvasService';

function HomePage() {
  const [activeEvents, setActiveEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getActiveEvents();
        setActiveEvents(events);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  return (
    <Layout>
      <div className="home-page">
        <section className="hero-section">
          <h1>Collaborative Pixel Art on Solana</h1>
          <p>Join the community, place pixels, and own a piece of digital history</p>
          <WalletConnect />
        </section>
        
        <section className="active-events">
          <h2>Active Canvas Events</h2>
          {isLoading ? (
            <p>Loading events...</p>
          ) : activeEvents.length > 0 ? (
            <div className="events-grid">
              {activeEvents.map(event => (
                <div key={event.id} className="event-card">
                  <h3>{event.name}</h3>
                  <p>Ends in: {event.timeRemaining}</p>
                  <p>{event.pixelsPlaced} pixels placed</p>
                  <Link to={`/canvas/${event.id}`} className="join-button">
                    Join Canvas
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p>No active events at the moment. Check back soon!</p>
          )}
        </section>
        
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Connect Your Wallet</h3>
              <p>Link your Solana wallet to participate in canvas events</p>
            </div>
            <div className="step">
              <h3>2. Verify University</h3>
              <p>Confirm your university affiliation to join your school's efforts</p>
            </div>
            <div className="step">
              <h3>3. Purchase Pixel Space</h3>
              <p>Buy space on the canvas to place your pixels</p>
            </div>
            <div className="step">
              <h3>4. Create Together</h3>
              <p>Collaborate with others to create amazing pixel art</p>
            </div>
          </div>
        </section>
        
        <section className="past-canvases">
          <h2>Past Canvas NFTs</h2>
          <NFTGallery limit={3} />
          <Link to="/gallery" className="view-all">
            View All Canvas NFTs
          </Link>
        </section>
      </div>
    </Layout>
  );
}

export default HomePage;
