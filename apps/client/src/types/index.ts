export interface IPageResponse<T> {
  page: number,
  pageSize: number,
  totalCount?: number,
  total?: number,
  data: T[]
}

export interface IPageRequest {
  page: number;
  limit: number;
}

export const pageDefault: IPageResponse<any> = {
  page: 0,
  pageSize: 0,
  total: 0,
  data: []
}
