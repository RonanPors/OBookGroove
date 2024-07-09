import crypto from 'crypto';

export function generateRandomString(length) {
  return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
};
