import { decrypt, encrypt } from './cipher';
import {EncryptedSecret, ENCRYPTION_SUB_MASK} from "@abflags/shared";

export function encryptSecret(text: string, encryptionKey: string): EncryptedSecret {
  const encrypted = encrypt(text, encryptionKey);

  return `${ENCRYPTION_SUB_MASK}${encrypted}`;
}

export function decryptSecret(text: string | EncryptedSecret, encryptionKey: string): string {
  let encryptedSecret = text;

  if (isEncrypted(text)) {
    encryptedSecret = text.slice(ENCRYPTION_SUB_MASK.length);
  }

  return decrypt(encryptedSecret, encryptionKey);
}

export function encryptApiKey(apiKey: string, encryptionKey: string): EncryptedSecret {
  if (isEncrypted(apiKey)) {
    return apiKey;
  }

  return encryptSecret(apiKey, encryptionKey);
}

export function decryptApiKey(apiKey: string, encryptionKey: string): string {
  if (isEncrypted(apiKey)) {
    return decryptSecret(apiKey, encryptionKey);
  }

  return apiKey;
}

function isEncrypted(text: string): text is EncryptedSecret {
  return text.startsWith(ENCRYPTION_SUB_MASK);
}
