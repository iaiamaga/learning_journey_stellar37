const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');

// Generate a random keypair
const pair = StellarSdk.Keypair.random();

console.log('Public Key:', pair.publicKey());
console.log('Secret Key:', pair.secret());

// Fund the account using FriendBot (only works on testnet)
async function fundAccount(publicKey) {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    const responseJSON = await response.json();
    console.log('FriendBot response:', responseJSON);
    if (responseJSON.hash) {
      console.log('Account funded successfully!');
      console.log('Transaction hash:', responseJSON.hash);
    } else {
      console.error('Error funding account:', responseJSON);
    }
  } catch (error) {
    console.error('Error calling FriendBot:', error);
  }
}

// Check account details on Horizon testnet
async function checkAccountDetails(publicKey) {
  try {
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(publicKey);
    console.log('Account Details:');
    console.log('  Sequence Number:', account.sequence);
    
    // Find XLM balance (native asset)
    const xlmbBalance = account.balances.find(balance => balance.asset_type === 'native');
    if (xlmbBalance) {
      console.log('  XLM Balance:', xlmbBalance.balance);
    } else {
      console.log('  XLM Balance: 0');
    }
  } catch (error) {
    console.error('Error fetching account details:', error);
  }
}

// Fund the newly created account and then check its details
async function main() {
  await fundAccount(pair.publicKey());
  // Wait a moment for the funding to be processed
  await new Promise(resolve => setTimeout(resolve, 3000));
  await checkAccountDetails(pair.publicKey());
}

main();