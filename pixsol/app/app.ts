import express from 'express';
import { Connection, Keypair } from '@solana/web3.js';
import fs from "fs";
import {AnchorProvider, Program, Wallet, setProvider, Idl} from '@coral-xyz/anchor';
import idl from './pixsol.json' ;

const app = express();
app.use(express.json());

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
  
    res.json({
      message: 'Canvas created successfully',
      canvasId: canvasAccount.publicKey.toString(),
    });
  } catch (error) {
    console.error('Error creating canvas:', error);
    res.status(500).json({ error: 'Failed to create canvas' });
  }
});
  

app.post('/create-pixel', async (req, res) => {
  try {
    const { canvasId, x, y, color, modifierId } = req.body;
    const pixelAccount = Keypair.generate();
    const provider = new AnchorProvider(connection, new Wallet(wallet), {});
    setProvider(provider);
    const program = new Program(idl as Idl, provider);
    console.log("gonna start creating!", pixelAccount.publicKey.toString());

    var signature = await program.methods.createPixel(x, y, color).accounts({
      canvas: canvasId, // Public key passed by the client
      user: wallet.publicKey,
      pixel: pixelAccount.publicKey,
      modifier: modifierId // Public key passed by the client
    }).signers([wallet, pixelAccount]).rpc();

    console.log('Pixel created:', pixelAccount.publicKey.toString());
  
    res.json({
      message: 'Pixel created successfully',
      canvasId: pixelAccount.publicKey.toString(),
    });

  } catch (error) {
    console.error('Error creating pixel:', error);
    res.status(500).json({ error: 'Failed to create pixel' });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
