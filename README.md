
# Stellar SDK Demonstration Project
## Project Overview
This project demonstrates core Stellar SDK functionality for account management and transaction processing on the Stellar testnet. It includes two complementary tools that showcase different aspects of Stellar development: 
- keypair generation/funding, 
- payment transaction construction and transaction submission.
- 
## Technology Stack
- Node.js: JavaScript runtime environment
- Stellar SDK (stellar-sdk): Official library for interacting with the Stellar network
- node-fetch: HTTP client for making requests to external services (Friendbot)

```
Project Structure
├── generate_keypair.js  # Creates and funds new Stellar accounts
├── send_payment.js      # Initial payment script with error to refactor and learn
├── sendPayment.js       # Corrected payment transaction script
├── package.json         # Project dependencies and metadata
├── package-lock.json    # Dependency lockfile
└── README.md            # This file
```

# Detailed Tool Explanations
## 1. generate_keypair.js
Purpose: Demonstrates account creation and funding process on Stellar testnet. 

**What it does:**
- Generates a random Stellar keypair (public/secret key pair)
- Uses Friendbot to automatically fund the new account on testnet
- Queries Horizon to verify account creation and check XLM balance
- Shows complete lifecycle: creation → funding → verification

**Stellar SDK Features Used:**
- StellarSdk.Keypair.random() - Key generation
- StellarSdk.Horizon.Server - Horizon testnet connection
- server.loadAccount() - Account verification
- Friendbot API integration via node-fetch

##### **How to Use:**
```
node generate_keypair.js
```

Outputs:
- New public key (account address)
- New secret key (for signing transactions)
- Friendbot funding response
- Account sequence number and XLM balance

**Important:** The secret key is shown only once - save it securely! Never commit secret keys to version control.

---

## 2. sendPayment.js (Corrected Version)
**Purpose:** Demonstrates constructing, signing, and submitting a payment transaction

**What it does:**
- Loads an existing account from Horizon using secret key
- Builds a payment operation sending 10 XLM to a destination account
- Signs the transaction with the source account's secret key
- Submits to Stellar testnet Horizon
- Returns and displays the transaction hash for verification

**Stellar SDK Features Used:**
- StellarSdk.Keypair.fromSecret() - Account access from secret key
- StellarSdk.TransactionBuilder - Transaction construction
- StellarSdk.Operation.payment() - Payment operation creation
- transaction.sign() - Transaction signing
- server.submitTransaction() - Network submission

##### **How to Use:**
1. **Edit the script to replace placeholder values:**
   - YOUR_SOURCE_SECRET_KEY → Your account's secret key (from generate_keypair.js or existing account)
   - DESTINATION_PUBLIC_KEY → Recipient's public key
1. Ensure source account has sufficient XLM balance (≥10 XLM + fees) 
2. Run:
	`node sendPayment.js`

**Outputs:**
- Confirmation of account loading
- Transaction signed notification
- Transaction submission success
- Transaction hash (viewable on Stellar Explorer)
- Link to testnet explorer for transaction details

---
## 3. send_payment.js (Initial Version)
**Purpose:** Shows common implementation mistake for educational comparison

**What it shows:**
- Incorrect usage of StellarSdk.Network.useTestNetwork() method
- Results in TypeError: Cannot read properties of undefined
- Demonstrates importance of checking SDK documentation for correct API usage

**For sendPayment.js to work, you need:**
1. A funded source account on Stellar testnet (obtain via):
   - Running generate_keypair.js first
   - Or using Stellar Laboratory's faucet: https://stellar.org/fundraiser/
2. Destination account public key (can be another generated account)
Installation

### 4. Stellar Explorer
After making the steps, coy your account **public key** and paste on Stellar Explorer: https://stellar.expert/explorer/testnet/tx/123abc...def456

You'll be able to see the amout of XLM in the account.

You can copy the transaction hash to verify if the transaction really happend and some other informations.

---
# Install dependencies
`npm install`

### Verify installation
Run: `npm list`

**Dependencies:**
- @stellar/stellar-sdk: Core Stellar network interaction
- axios: HTTP client (alternative to node-fetch)
- node-fetch: Used for Friendbot API calls in generate_keypair.js

#### Security Important Notes

**Secret Key Handling:**
- NEVER commit secret keys to GitHub or any public repository
- The scripts include validation to prevent running with placeholder keys
- Consider using environment variables or secure vaults for production use
- For learning purposes, keys are shown in console - clear terminal history afterward

##### **Testnet vs Mainnet:**
- All scripts are configured for testnet only
- Testnet XLM has no real value - safe for experimentation
- To use mainnet:
  1. Change Horizon URL to https://horizon.stellar.org
  2. Change network passphrase to Public Global Stellar Network ; June 2019
  3. Use mainnet-funded accounts only

---

### **Transaction Details Explained**

##### Payment Operation Components
In sendPayment.js:
- Amount: '10' (10 XLM as string - SDK requires string format for precision)
- Asset: StellarSdk.Asset.native() (XLM is Stellar's native asset)
- Destination: Public key of recipient account
- Fee: Automatically set to StellarSdk.BASE_FEE (100 stroops = 0.0001 XLM)
- Timeout: 30 seconds (prevents stale transactions)
Transaction Lifecycle
1. Account loading → Gets current sequence number
2. Transaction building → Increments sequence number implicitly
3. Signing → Cryptographic signature with secret key
4. Submission → Horizon validates and broadcasts to network
5. Confirmation → Transaction hash returned upon acceptance
Troubleshooting Common Issues
"Account does not exist"
- Solution: Fund account first using Friendbot or faucet
- Verify correct network (testnet vs mainnet)
"Insufficient balance"
- Solution: Ensure account has ≥10.0001 XLM (10 XLM + ~0.0001 XLM fee)
- Check balance via: https://horizon-testnet.stellar.org/accounts/{public_key}
"Transaction failed"
- Check Horizon error response in console output
- Common causes: Wrong sequence number, insufficient auth, invalid operation
Network Connection Issues
- Verify internet connectivity
- Test Horizon endpoint: curl https://horizon-testnet.stellar.org
Further Learning Resources
Stellar Documentation
- Official Stellar SDK Docs (https://developers.stellar.org/docs/js-stellar-sdk/)
- Horizon API Reference (https://developers.stellar.org/api/horizon/)
- Stellar Laboratory (https://stellar.org/laboratory/) (for transaction building)
Next Steps to Explore
1. Multi-signature accounts
2. Custom asset issuance
3. Decentralized exchange offers
4. Inflation pool participation
5. Smart contracts via Soroban
Contributing
This is a learning demonstration project. For improvements:
6. Fix the erroneous send_payment.js as learning exercise
7. Add input validation and error handling
8. Implement environment variable configuration
9. Add batch payment functionality
10. Create unit tests with mock Horizon server
Last updated: May 2026 | For educational use with Stellar Testnet only

----

# Configuration Guide
#### How to Configure Your Secret Key in sendPayment.js

If you're encountering **errors when running sendPayment.js**, it's likely because the placeholder keys haven't been properly replaced. Follow these exact steps:

1. Open sendPayment.js in your text editor
2. Locate these lines (around line 10-11):
      const sourceSecret = 'YOUR_SOURCE_SECRET_KEY'; // e.g., 'SA...'
   const destPublicKey = 'DESTINATION_PUBLIC_KEY'; // e.g., 'GD...'
   
3. Replace EXACTLY as shown below:
      const sourceSecret = 'YOUR_ACTUAL_SECRET_KEY_HERE'; // MUST start with 'S'
   const destPublicKey = 'YOUR_DESTINATION_PUBLIC_KEY_HERE'; // MUST start with 'G'
   
4. Critical formatting rules:
   - Keep the single quotes around both keys
   - Do not add spaces inside the quotes
   - Secret key must be your full secret key (starts with S, 56 characters)
   - Public key must be the destination account's public key (starts with G, 56 characters)
   - Example correct format:
          const sourceSecret = 'SB2X...YOUR_FULL_SECRET_KEY...';
     const destPublicKey = 'GD3Z...DESTINATION_PUBLIC_KEY...';
     
#### Where to Get Your Keys

Option 1: Generate New Testnet Account (Recommended for Testing)
1. Run: node generate_keypair.js
2. Copy the Secret Key (starts with S) → paste into sourceSecret
3. Copy the Public Key (starts with G) → paste into destPublicKey  
4. Important: The generated account is automatically funded by Friendbot

Option 2: Use Existing Testnet Account
5. Get your secret key from:
   - Stellar Laboratory → Account Viewer
   - Or wherever you securely stored it when creating the account
2. Ensure it's a testnet account (not mainnet)
3. Get destination public key similarly

If You Still Get Errors
4. "Please set your source secret key" → You didn't replace the placeholder
5. "Error: Invalid secret key" → Key format wrong (check starts with S, 56 chars, correct characters)
6. Horizon 404 error → Account doesn't exist on testnet (fund it first with Friendbot)
7. Insufficient balance → Need ≥10.0001 XLM in source account (10 XLM + ~0.0001 fee)

💡 Pro Tip: For testing, run generate_keypair.js first to get a fresh funded account, then use those keys in sendPayment.js with any destination address (even another newly generated account).
