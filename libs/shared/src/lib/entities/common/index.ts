export * from './bug-report.interface';

export interface IPageResponse<T> {
  data: T[];
  total: number;
}