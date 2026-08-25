import { randomBytes } from 'node:crypto';

/**
 * UUID v7 — time-ordered, so rows sort by creation and index locality is good.
 * Generated in the application (and on offline clients) rather than by the
 * database, so a record created offline keeps its identity when it syncs.
 */
export function uuidv7(): string {
  const timestamp = Date.now();
  const bytes = randomBytes(16);

  bytes[0] = (timestamp / 2 ** 40) & 0xff;
  bytes[1] = (timestamp / 2 ** 32) & 0xff;
  bytes[2] = (timestamp / 2 ** 24) & 0xff;
  bytes[3] = (timestamp / 2 ** 16) & 0xff;
  bytes[4] = (timestamp / 2 ** 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  // version 7
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // variant 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}
