import { 
  Connection, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  PublicKey, 
  sendAndConfirmTransaction,
  TransactionInstruction
} from '@solana/web3.js';
import bs58 from 'bs58';

// Solana Memo Program ID
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXib96qFbncnsgz9Pnd6SjKshr6LQSrB');

export class SolanaService {
  private connection: Connection;
  private notaryKeypair: Keypair | null = null;

  constructor() {
    // Use Mainnet Beta for production
    this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    
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
      // Check balance - if too low, we might need to airdrop or warn
      const balance = await this.connection.getBalance(this.notaryKeypair.publicKey);
      if (balance < 1000000) { // 0.001 SOL
         console.warn('Notary wallet balance low. Transaction might fail.');
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
    } catch (error) {
      console.error('Failed to record consent on Solana:', error);
      return null;
    }
  }

  getNotaryPublicKey(): string | null {
    return this.notaryKeypair?.publicKey.toBase58() || null;
  }
}

export const solanaService = new SolanaService();
