import { 
  Connection, 
  Keypair, 
  Transaction, 
  PublicKey, 
  sendAndConfirmTransaction,
  TransactionInstruction,
  SendTransactionError
} from '@solana/web3.js';
import bs58 from 'bs58';

// Solana Memo Program ID (v2)
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXib96qFbncnsgz9Pnd6SjKshr6LQSrB');

export class SolanaService {
  private connection: Connection;
  private notaryKeypair: Keypair | null = null;

  constructor() {
    // Use devnet for development to avoid "program not found" errors on mainnet 
    // and to allow for free testing.
    const network = process.env.SOLANA_NETWORK || 'devnet';
    const endpoint = network === 'mainnet-beta' 
      ? 'https://api.mainnet-beta.solana.com' 
      : 'https://api.devnet.solana.com';
      
    this.connection = new Connection(endpoint, 'confirmed');
    
    const privateKey = process.env.SOLANA_NOTARY_PRIVATE_KEY;
    if (privateKey) {
      try {
        this.notaryKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      } catch (e) {
        console.error('Invalid SOLANA_NOTARY_PRIVATE_KEY format. Expected base58 string.');
      }
    }
  }

  /**
   * Records a consent hash on the Solana blockchain using the Memo Program.
   * In a real production app, this would be a smart contract call.
   */
  async recordConsentOnChain(userId: string, categoryName: string, hash: string): Promise<string | null> {
    if (!this.notaryKeypair) {
      console.warn('Solana Notary Key not configured. Skipping on-chain recording.');
      return null;
    }

    try {
      // Check balance - if zero, we must airdrop on devnet or warn
      const balance = await this.connection.getBalance(this.notaryKeypair.publicKey);
      
      if (balance === 0) {
        const network = process.env.SOLANA_NETWORK || 'devnet';
        if (network === 'devnet') {
          console.log(`Notary wallet ${this.notaryKeypair.publicKey.toBase58()} has 0 balance. Requesting airdrop on devnet...`);
          try {
            const airdropSignature = await this.connection.requestAirdrop(
              this.notaryKeypair.publicKey,
              1 * 1000000000 // 1 SOL
            );
            const latestBlockHash = await this.connection.getLatestBlockhash();
            await this.connection.confirmTransaction({
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
              signature: airdropSignature
            });
            console.log('Airdrop successful!');
          } catch (airdropError) {
            console.error('Airdrop failed. Please fund the notary wallet manually:', this.notaryKeypair.publicKey.toBase58());
            return null;
          }
        } else {
          console.error('Notary wallet has 0 balance on mainnet. Please fund it:', this.notaryKeypair.publicKey.toBase58());
          return null;
        }
      } else if (balance < 10000000) { // 0.01 SOL
         console.warn('Notary wallet balance low. Consider funding it soon.');
      }

      const memoData = JSON.stringify({
        uid: userId.substring(0, 8),
        cat: categoryName,
        hash: hash
      });

      const transaction = new Transaction().add(
        new TransactionInstruction({
          keys: [{ pubkey: this.notaryKeypair.publicKey, isSigner: true, isWritable: true }],
          programId: MEMO_PROGRAM_ID,
          data: Buffer.from(memoData, 'utf-8'),
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.notaryKeypair]
      );

      console.log(`Consent recorded on Solana! Signature: ${signature}`);
      return signature;
    } catch (error: any) {
      if (error instanceof SendTransactionError) {
        console.error('Solana Transaction Failed!');
        console.error('Error Message:', error.message);
        try {
          const logs = await error.getLogs(this.connection);
          console.error('Transaction Logs:', logs);
        } catch (logError) {
          console.error('Could not fetch transaction logs:', logError);
        }
      } else {
        console.error('Failed to record consent on Solana:', error);
      }
      return null;
    }
  }

  getNotaryPublicKey(): string | null {
    return this.notaryKeypair?.publicKey.toBase58() || null;
  }

  getExplorerUrl(signature: string): string {
    return `https://explorer.solana.com/tx/${signature}`;
  }
}

export const solanaService = new SolanaService();
