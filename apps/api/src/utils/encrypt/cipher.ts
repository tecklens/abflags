import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const IV_LENGTH = 16;
const CIPHER_ALGO = 'aes-256-cbc';

export function encrypt(text: string, encryptionKey: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(
    CIPHER_ALGO,
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string, encryptionKey: string) {
  const textParts = text.split(':');
  // @ts-ignore
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(
    CIPHER_ALGO,
    Buffer.from(encryptionKey),
    iv,
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
