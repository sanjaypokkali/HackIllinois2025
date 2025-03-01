import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram } from '@solana/web3.js';

// Configure Solana connection (use devnet for development)
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// Create a transaction to place a pixel
export const createPlacePixelTransaction = async (publicKey, eventId, x, y, color) => {
  try {
    // Create a new transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('11111111111111111111111111111111'),
        lamports: 1000, // 0.000001 SOL
      })
    );
    
    // Add metadata to transaction (in production, this would be program data)
    const metadata = {
      eventId,
      x,
      y,
      color,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Created pixel placement transaction with metadata:', metadata);
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
};

// Purchase canvas space
export const purchaseCanvasSpace = async (publicKey, sendTransaction, eventId) => {
  try {
    // Create a new transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('11111111111111111111111111111111'),
        lamports: 100000000, // 0.1 SOL
      })
    );
    
    // Sign and send transaction using the provided sendTransaction function
    const signature = await sendTransaction(transaction, connection);
    
    return {
      success: true,
      txSignature: signature,
    };
  } catch (error) {
    console.error('Error purchasing canvas space:', error);
    throw new Error('Failed to purchase canvas space');
  }
};

// Get NFT details
export const getNFTDetails = async (nftId) => {
  try {
    // In a real implementation, this would fetch NFT metadata from Solana
    // For now, we'll return dummy data
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: nftId,
      name: `Canvas #${nftId.split('-')[1]}`,
      description: 'A collaborative pixel art canvas created by the community',
      imageUrl: `https://via.placeholder.com/500x500?text=Canvas+NFT+${nftId.split('-')[1]}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      mintAddress: new PublicKey('8xj7dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm').toString(),
      owner: new PublicKey('5xj7dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm').toString(),
      participants: Math.floor(Math.random() * 500) + 100,
      totalPixels: 10000,
      pixelsPlaced: Math.floor(Math.random() * 8000) + 2000,
    };
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    throw new Error('Failed to fetch NFT details');
  }
};

// Mint NFT from canvas
export const mintCanvasNFT = async (publicKey, sendTransaction, eventId) => {
  try {
    // Create a transaction to mint an NFT
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('11111111111111111111111111111111'),
        lamports: 50000000, // 0.05 SOL as an example fee
      })
    );
    
    // Sign and send the transaction
    const signature = await sendTransaction(transaction, connection);
    
    return {
      success: true,
      nftId: `nft-${Math.floor(Math.random() * 1000)}`,
      mintAddress: new PublicKey('8xj7dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm').toString(),
      txSignature: signature,
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw new Error('Failed to mint NFT');
  }
};

// Get user's NFTs
export const getUserNFTs = async (publicKey) => {
  try {
    if (!publicKey) return [];
    
    // In a real implementation, this would fetch NFTs owned by the user
    // For now, we'll return dummy data
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate 0-3 random NFTs
    const count = Math.floor(Math.random() * 4);
    const nfts = [];
    
    for (let i = 0; i < count; i++) {
      const id = Math.floor(Math.random() * 1000);
      nfts.push({
        id: `nft-${id}`,
        name: `Canvas #${id}`,
        description: 'A collaborative pixel art canvas created by the community',
        imageUrl: `https://via.placeholder.com/300x300?text=Canvas+NFT+${id}`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        mintAddress: new PublicKey('8xj7dE4kLmUCz1nNWKgpvs9QT2KgX5vUQh7xLcYDVvdm').toString(),
      });
    }
    
    return nfts;
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    throw new Error('Failed to fetch user NFTs');
  }
};
