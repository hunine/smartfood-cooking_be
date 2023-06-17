import { BCRYPT_SALT_ROUND } from '@config/env';
import { hashSync, compareSync } from 'bcrypt';

const saltRounds = BCRYPT_SALT_ROUND;

/**
 * @Usage Hash string using bcrypt hashing function
 */
export function hashString(text: string): string {
  return hashSync(text, saltRounds);
}

/**
 * @Usage Compare Hash string with normal string using bcrypt hashing function
 */
export function compareHashString(
  plainText: string,
  hashText: string,
): boolean {
  return compareSync(plainText, hashText);
}
