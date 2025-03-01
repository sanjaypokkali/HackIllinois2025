from solders.keypair import Keypair
import json

# Generate a new keypair
keypair = Keypair()
with open("my_keypair.json", "w") as f:
    f.write(json.dumps(list(keypair.to_bytes())))

# Load keypair from file
with open("my_keypair.json", "r") as f:
    secret = json.load(f)

loaded_keypair = Keypair.from_bytes(bytes(secret))
print("Loaded Public Key:", loaded_keypair.pubkey())
