import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPastCanvasNFTs } from '../services/canvasService';

function NFTGallery({ limit }) {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setIsLoading(true);
        const pastNFTs = await getPastCanvasNFTs(limit);
        setNfts(pastNFTs);
      } catch (error) {
        console.error('Failed to load NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNFTs();
  }, [limit]);
  
  if (isLoading) {
    return <div className="loading-nfts">Loading past canvas NFTs...</div>;
  }
  
  return (
    <div className="nft-gallery">
      {nfts.length > 0 ? (
        <div className="nft-grid">
          {nfts.map(nft => (
            <div key={nft.id} className="nft-card">
              <img src={nft.imageUrl} alt={nft.name} className="nft-image" />
              <h3>{nft.name}</h3>
              <p>Created: {new Date(nft.createdAt).toLocaleDateString()}</p>
              <p>{nft.participants} participants</p>
              <Link to={`/merch/${nft.id}`} className="view-merch-button">
                View Merchandise
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No past canvas NFTs available yet.</p>
      )}
    </div>
  );
}

export default NFTGallery;
