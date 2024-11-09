export const EVENTS = {
  INIT: 'initialized',
  ERROR: 'error',
  WARN: 'warn',
  READY: 'ready',
  UPDATE: 'update',
  IMPRESSION: 'impression',
  SENT: 'sent',
  RECOVERED: 'recovered',
};
export function resolveContextValue(value: any, field: string): string | undefined {
  return ''
}

export const cleanValues = (values: any[]) => values.filter((v) => !!v).map((v) => v.trim());
