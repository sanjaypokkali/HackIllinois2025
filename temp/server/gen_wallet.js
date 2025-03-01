const { Keypair } = require("@solana/web3.js");
const fs = require("fs");


const keypair = Keypair.generate();

console.log("Public Key:", keypair.publicKey.toBase58());
console.log("Secret Key:", `[${keypair.secretKey.toString()}]`);
fs.writeFileSync("solana-keypair.json", JSON.stringify(Array.from(keypair.secretKey)));

console.log("Keypair saved to solana-keypair.json");
const loadedSecretKey = Uint8Array.from(JSON.parse(fs.readFileSync("solana-keypair.json")));
const loadedKeypair = Keypair.fromSecretKey(loadedSecretKey);

console.log("Loaded Public Key:", loadedKeypair.publicKey.toBase58());