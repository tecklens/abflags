export type CustomDataType = {
  [key: string]: string | string[] | boolean | number | undefined;
};

export const ENCRYPTION_SUB_MASK = 'sk.';

export type EncryptedSecret = `${typeof ENCRYPTION_SUB_MASK}${string}`;

export interface IResponseError {
  error: string;
  message: string;
  statusCode: number;
}
