// Dummy data for active events
const dummyActiveEvents = [
    {
      id: 'event-1',
      name: 'HackIllinois 2023 Canvas',
      timeRemaining: '2 days 4 hours',
      pixelsPlaced: 45678,
      participants: 230,
      universityId: 'uiuc'
    },
    {
      id: 'event-2',
      name: 'MIT Spring Hackathon Canvas',
      timeRemaining: '1 day 12 hours',
      pixelsPlaced: 32456,
      participants: 187,
      universityId: 'mit'
    },
    {
      id: 'event-3',
      name: 'Stanford Blockchain Week',
      timeRemaining: '5 hours 23 minutes',
      pixelsPlaced: 28934,
      participants: 156,
      universityId: 'stanford'
    }
  ];
  
  // Dummy data for past canvas NFTs
  const dummyPastNFTs = [
    {
      id: 'nft-1',
      name: 'HackIllinois 2022 Canvas',
      imageUrl: 'https://via.placeholder.com/300x300?text=Canvas+NFT+1',
      createdAt: '2022-04-15T12:00:00Z',
      participants: 345,
      mintAddress: '8xj7dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm'
    },
    {
      id: 'nft-2',
      name: 'Solana Summer Hackathon',
      imageUrl: 'https://via.placeholder.com/300x300?text=Canvas+NFT+2',
      createdAt: '2022-07-22T15:30:00Z',
      participants: 512,
      mintAddress: '9xF2dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm'
    },
    {
      id: 'nft-3',
      name: 'ETH Global Canvas',
      imageUrl: 'https://via.placeholder.com/300x300?text=Canvas+NFT+3',
      createdAt: '2022-10-05T09:15:00Z',
      participants: 423,
      mintAddress: '7xK5dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm'
    },
    {
      id: 'nft-4',
      name: 'Web3 Conference 2022',
      imageUrl: 'https://via.placeholder.com/300x300?text=Canvas+NFT+4',
      createdAt: '2022-11-18T14:45:00Z',
      participants: 289,
      mintAddress: '6xL3dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm'
    }
  ];
  
  // Dummy canvas state (10x10 grid)
  const dummyCanvasState = Array(10).fill().map(() => 
    Array(10).fill().map(() => ({
      color: '#FFFFFF',
      walletAddress: null
    }))
  );
  
  // Function to get active events
  export const getActiveEvents = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return dummyActiveEvents;
  };
  
  // Function to get past canvas NFTs
  export const getPastCanvasNFTs = async (limit = null) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If limit is provided, return only that many NFTs
    if (limit && typeof limit === 'number') {
      return dummyPastNFTs.slice(0, limit);
    }
    
    return dummyPastNFTs;
  };
  
  // Function to get canvas state
  export const getCanvasState = async (eventId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you would fetch the specific canvas state for the event
    // For now, return the dummy canvas with some random pixels filled
    const canvasState = JSON.parse(JSON.stringify(dummyCanvasState));
    
    // Fill some random pixels
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
      canvasState[y][x] = {
        color,
        walletAddress: `wallet${Math.floor(Math.random() * 1000)}`
      };
    }
    
    return canvasState;
  };
  
  // Function to get canvas history for animation
  export const getCanvasHistory = async (eventId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate 20 frames of history by progressively filling the canvas
    const history = [];
    const baseCanvas = JSON.parse(JSON.stringify(dummyCanvasState));
    
    for (let frame = 0; frame < 20; frame++) {
      const frameCanvas = JSON.parse(JSON.stringify(baseCanvas));
      
      // Add frame * 5 random pixels
      for (let i = 0; i < frame * 5; i++) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        frameCanvas[y][x] = {
          color,
          walletAddress: `wallet${Math.floor(Math.random() * 1000)}`
        };
      }
      
      history.push(frameCanvas);
    }
    
    return history;
  };
  
  // Function to place a pixel on the canvas
  export const placePixelOnCanvas = async (wallet, eventId, x, y, color) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real app, this would create a transaction on Solana
    console.log(`Placing pixel at (${x}, ${y}) with color ${color} for wallet ${wallet.publicKey.toString()}`);
    
    // Return success (in a real app, this would return the transaction signature)
    return {
      success: true,
      txSignature: `dummy_tx_${Math.random().toString(36).substring(2, 15)}`
    };
  };
  
  // Function to get merchandise for an NFT
  export const getMerchForNFT = async (nftId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Dummy merchandise data
    return [
      {
        id: `merch-${nftId}-1`,
        name: 'Canvas T-Shirt',
        description: 'Premium cotton t-shirt featuring the canvas artwork',
        price: 25.99,
        imageUrl: 'https://via.placeholder.com/200x200?text=T-Shirt',
        available: true
      },
      {
        id: `merch-${nftId}-2`,
        name: 'Canvas Poster',
        description: 'High-quality print of the canvas artwork',
        price: 19.99,
        imageUrl: 'https://via.placeholder.com/200x200?text=Poster',
        available: true
      },
      {
        id: `merch-${nftId}-3`,
        name: 'Canvas Mug',
        description: 'Ceramic mug featuring the canvas artwork',
        price: 14.99,
        imageUrl: 'https://via.placeholder.com/200x200?text=Mug',
        available: true
      },
      {
        id: `merch-${nftId}-4`,
        name: 'Canvas Hoodie',
        description: 'Comfortable hoodie featuring the canvas artwork',
        price: 39.99,
        imageUrl: 'https://via.placeholder.com/200x200?text=Hoodie',
        available: true
      }
    ];
  };
  