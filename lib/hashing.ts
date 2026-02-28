import { createHash } from 'crypto';

/**
 * Generates a unique consent hash for a data permission change.
 * In a real-world scenario, this could be recorded on-chain.
 */
export function generateConsentHash(userId: string, target: string, status: string): string {
  const timestamp = new Date().toISOString();
  const data = `${userId}:${target}:${status}:${timestamp}:${Math.random()}`;
  return createHash('sha256').update(data).digest('hex');
}
