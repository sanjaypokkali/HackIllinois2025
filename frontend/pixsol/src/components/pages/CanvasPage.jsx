import React from 'react';
import WalletConnect from '../auth/WalletConnect';
import Layout from '../layout/Layout';
import { useWallet } from '@solana/wallet-adapter-react';
import "../../styles/Canvas.css";
function CanvasPage({ eventId }) {
  const { publicKey } = useWallet();

  const mintNFT = () => {
    const payload = {
      "name": "HackIllinois2025",
      "symbol": "",
      "uri": "https://owcdn.net/img/67c30f6399a24.jpg",
      "seller_fee_basis_points": 0,
      "creators": [
            {
                "address": "7uDYxEDy1ovzqmk1iRRrncUc3LLeNdThZxy6v9iYxnnC",
                "share": 30
            },
            {
                "address": "GX87AKqEQmHFZSPxHdFpCeTWJfvJhp6Da4wKf1icU6LE",
                "share": 30
            },
            {
                "address": "9UPNfbd5c7HjphfvvDkKid553SGWZFmomf9xGQn4mhrx",
                "share": 40
            }
        ],
      "image": "https://owcdn.net/img/67c30f6399a24.jpg",
      "description": "This is the NFT Minted for HackIllinois 2025!"
    }
    const options = {
      method: 'POST', // or 'PUT', 'PATCH' depending on the API endpoint
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch('https://a5d7-130-126-255-236.ngrok-free.app/mint-nft', options)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('API response:', data);
  })
  .catch(error => {
    console.error('Error during API call:', error);
  });
    alert("NFT Minted Successfully!");
  };

  return (
    <Layout>
      <div className="canvas-page">
        <div className="canvas-header">
          <h1>Cuberts Demo Day Canvas</h1>
          <button className="mint-button" onClick={mintNFT}>Mint NFT</button>
        </div>
        {publicKey && (
          <div className="iframe-container">
            {/* Pass eventId and walletId as query parameters to the iframe */}
            <iframe
              src={`https://ef45-130-126-255-20.ngrok-free.app/ace?walletId=${publicKey}`}
              title={`Canvas Event ${eventId}`}
              width="100%"
              height="600px"
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            ></iframe>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CanvasPage;
