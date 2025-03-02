import express from 'express';
import { Connection, Keypair } from '@solana/web3.js';
import fs from "fs";
import {AnchorProvider, Program, Wallet, setProvider, Idl} from '@coral-xyz/anchor';
import idl from './pixsol.json' ;

const app = express();
app.use(express.json());

const redis = require('redis');

// Redis connection configuration
const redisConfig = {
  url: `redis://:${process.env.REDIS_PASSWORD || 'cuberts'}@${process.env.REDIS_HOST || '52.195.165.19'}:${process.env.REDIS_PORT || 6379}`,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000)
  },
  password: process.env.REDIS_PASSWORD || 'cuberts',
  legacyMode: false,
  disableOfflineQueue: false,
};

const createRedisClient = async () => {
  const client = redis.createClient({
    ...redisConfig,
    pingInterval: 1000
  });
  
  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  
  client.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  await client.connect();
  return client;
};

// Create clients for different databases (similar to the Python implementation)
// Declare clients that will be initialized in the init function
let profileDb;
let canvasDb;
let accessControlDb;
let organizationDb;
// Initialize Redis clients
const initRedisClients = async () => {
  profileDb = await createRedisClient();
  canvasDb = await createRedisClient();
  accessControlDb = await createRedisClient();
  organizationDb = await createRedisClient();
};

// Initialize Redis clients immediately
initRedisClients().catch(err => {
  console.error('Failed to initialize Redis clients:', err);
  process.exit(1);
});

// Connect to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Load your wallet keypair
const loadedSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("/Users/sanjay/.config/solana/id.json", 'utf-8')));
const wallet = Keypair.fromSecretKey(loadedSecretKey);

app.post('/create-canvas', async (req, res) => {
  try {
    const { width, height } = req.body;

    const canvasAccount = Keypair.generate();

    const provider = new AnchorProvider(connection, new Wallet(wallet), {});
    setProvider(provider);
    const program = new Program(idl as Idl, provider);

    var signture = await program.methods.createCanvas(width, height).accounts({
      canvas: canvasAccount.publicKey,
      user: wallet.publicKey
    }).signers([wallet, canvasAccount]).rpc();
 
    console.log('Canvas created:', canvasAccount.publicKey.toString());
    // Store canvas information in Redis
    await canvasDb.set("canvas:" + canvasAccount.publicKey.toString(), JSON.stringify({ width, height }))
    res.json({
      message: 'Canvas created successfully',
      canvasId: canvasAccount.publicKey.toString(),

    });
  } catch (error) {
    console.error('Error creating canvas:', error);
    res.status(500).json({ error: 'Failed to create canvas' });
  }
  
});
  

app.post('/set-pixel', async (req, res) => {
  console.log
  try {
    const { canvasId, x, y, color, modifierId } = req.body;
    const provider = new AnchorProvider(connection, new Wallet(wallet), {});
    setProvider(provider);
    const program = new Program(idl as Idl, provider);
    // Check if the canvas exists in Redis and get pixelAccountAddress using canvasId, x, y
    const pixelAccountAddress = await canvasDb.get("pixel:" + JSON.stringify({ canvasId, x, y }));
    if (pixelAccountAddress) {// if canvas is found
        var signature = await program.methods.updatePixel(color).accounts({
        pixel: JSON.parse(pixelAccountAddress).pixelAccount, // Use the pixel account address from the client
        user: wallet.publicKey,
        modifier: modifierId
      }).rpc();
  
      res.json({ 
        message: 'Pixel updated successfully',
      });
    } else {
      const pixelAccount = Keypair.generate();
  
      console.log("gonna start creating!", pixelAccount.publicKey.toString());
      console.log(wallet.publicKey.toString())
      var signature = await program.methods.createPixel(x, y, color).accounts({
        canvas: canvasId, // Public key passed by the client
        user: wallet.publicKey,
        pixel: pixelAccount.publicKey,
        modifier: modifierId // Public key passed by the client
      }).signers([wallet, pixelAccount]).rpc();

      console.log('Pixel created:', pixelAccount.publicKey.toString());
      // insert pixel account address in Redis
      await canvasDb.set("pixel:" + JSON.stringify({ canvasId, x, y }), JSON.stringify({ pixelAccount: pixelAccount.publicKey.toString(), color }))
      res.json({
        message: 'Pixel created successfully',
        pixelAccountId: pixelAccount.publicKey.toString(),
        x: x,
        y: y,
        canvasId: canvasId,
        redis_id: JSON.stringify({ canvasId, x, y })
      });
    }

  } catch (error) {
    console.error('Error creating pixel:', error);
    res.status(500).json({ error: 'Failed to create pixel' });
  }
});

// app.post('/update-pixel', async (req, res) => {
//   try {
//     const { color, pixelAccountAddress, modifierId } = req.body; // Updated to use pixelAccountAddress
//     const provider = new AnchorProvider(connection, new Wallet(wallet), {});
//     setProvider(provider);
//     const program = new Program(idl as Idl, provider);

//     var signature = await program.methods.updatePixel(color).accounts({
//       pixel: pixelAccountAddress, // Use the pixel account address from the client
//       user: wallet.publicKey,
//       modifier: modifierId
//     }).rpc();

//     res.json({ 
//       message: 'Pixel updated successfully',
//     });

//   } catch (error) {
//     console.error('Error updating pixel:', error);
//     res.status(500).json({ error: 'Failed to update pixel' });
//   }

// });



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
