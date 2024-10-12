import {AbContext} from "../types";

export const EVENTS = {
  INIT: 'initialized',
  ERROR: 'error',
  READY: 'ready',
  UPDATE: 'update',
  IMPRESSION: 'impression',
  SENT: 'sent',
  RECOVERED: 'recovered',
};

export const notNullOrUndefined = ([, value]: [string, string]) =>
  value !== undefined && value !== null;

export const contextString = (context: AbContext): string => {

  return JSON.stringify(context);
};

const sha256 = async (input: string): Promise<string> => {
  const cryptoSubtle =
    typeof globalThis !== 'undefined' && globalThis.crypto?.subtle
      ? globalThis.crypto?.subtle
      : undefined;

  if (
    typeof TextEncoder === 'undefined' ||
    !cryptoSubtle?.digest ||
    typeof Uint8Array === 'undefined'
  ) {
    throw new Error('Hashing function not available');
  }

  const msgUint8 = new TextEncoder().encode(input);
  const hashBuffer = await cryptoSubtle.digest('SHA-256', msgUint8);
  return Array.from(new Uint8Array(hashBuffer))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
};
export const computeContextHashValue = async (obj: AbContext) => {
  const value = contextString(obj);

  try {
    return await sha256(value);
  } catch {
    return value;
  }
};

export const resolveFetch = () => {
  try {
    if (typeof window !== 'undefined' && 'fetch' in window) {
      return fetch.bind(window);
    }

    if ('fetch' in globalThis) {
      return fetch.bind(globalThis);
    }
  } catch (e) {
    console.error('Unleash failed to resolve "fetch"', e);
  }

  return undefined;
};

export const resolveAbortController = () => {
  try {
    if (typeof window !== 'undefined' && 'AbortController' in window) {
      return new window.AbortController();
    }

    if ('fetch' in globalThis) {
      return new globalThis.AbortController();
    }
  } catch (e) {
    console.error('Unleash failed to resolve "AbortController" factory', e);
  }
};
