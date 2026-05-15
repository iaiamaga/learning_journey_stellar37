const StellarSdk = require('stellar-sdk');

// ===== CONFIGURATION =====
// Replace these values with your own

// Your source account secret key (the account that will send the payment)
// Get this from your existing testnet account
const SOURCE_SECRET_KEY = 'SA4PTPTSMES3JLNOYNNYMKNYRVZNDJ7AK3WR2FHNTCNCQXOO6FVD3XKY'; // <-- REPLACE WITH YOUR SECRET KEY

// Destination account public key (where you're sending the payment)
const DESTINATION_PUBLIC_KEY = 'GBQPUIYV5DG55QZCMYRANQQEIXULZL4WDIQHO3C4G2OBREHOMY3F7PXD'; // <-- REPLACE WITH DESTINATION PUBLIC KEY

// Amount to send (in XLM)
const AMOUNT_XLM = '10';
// ===== END CONFIGURATION =====

async function sendPayment() {
  try {
    // Initialize the server connection to Horizon testnet
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    
    // Create keypair from secret key
    const sourceKeyPair = StellarSdk.Keypair.fromSecret(SOURCE_SECRET_KEY);
    console.log(`Source Account: ${sourceKeyPair.publicKey()}`);
    console.log(`Destination Account: ${DESTINATION_PUBLIC_KEY}`);
    
    // 1) Load the source account from Horizon testnet
    console.log('Loading source account from Horizon...');
    const sourceAccount = await server.loadAccount(sourceKeyPair);
    console.log(`Account sequence: ${sourceAccount.sequence}`);
    
    // 2) Build a transaction payment of 10 XLM to DEST_KEY
    console.log(`Building payment transaction for ${AMOUNT_XLM} XLM...`);
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: DESTINATION_PUBLIC_KEY,
        asset: StellarSdk.Asset.native(), // Native asset is XLM
        amount: AMOUNT_XLM
      }))
      // Add a memo if desired (optional)
      // .addMemo(StellarSdk.Memo.text('Test Payment'))
      .setTimeout(30) // Transaction is valid for 30 seconds
      .build();
    
    // 3) Sign the transaction with your secretKey
    console.log('Signing transaction...');
    transaction.sign(sourceKeyPair);
    
    // 4) Submit the transaction to the testnet
    console.log('Submitting transaction to Horizon testnet...');
    const transactionResult = await server.submitTransaction(transaction);
    
    // 5) Print the transaction hash
    console.log('✅ Transaction submitted successfully!');
    console.log('Transaction Hash:', transactionResult.hash);
    console.log('Ledger:', transactionResult.ledger);
    console.log('Transaction URL: https://stellar.expert/explorer/testnet/tx/' + transactionResult.hash);
    
    return transactionResult.hash;
  } catch (error) {
    console.error('❌ Error processing transaction:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Extras:', error.response.data.extras || 'No extras');
    } else {
      console.error(error);
    }
    throw error;
  }
}

// Execute the payment function
sendPayment()
  .then(hash => {
    console.log('\n🎉 Payment completed successfully!');
    console.log('Transaction hash:', hash);
  })
  .catch(error => {
    console.error('\n💸 Payment failed:', error.message);
    process.exit(1);
  });
