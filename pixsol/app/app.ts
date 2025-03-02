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

    await program.methods.createCanvas(width, height).accounts({
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
  

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
