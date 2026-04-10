/**
 * Hashes a string using SHA-256 via the Web Crypto API.
 * This is used to anonymize PII (like User IDs) before sending to G4.
 *
 * @param message The string to hash
 * @returns A promise that resolves to the hex-encoded hash string
 */
export async function sha256(message: string): Promise<string> {
  const messageBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
