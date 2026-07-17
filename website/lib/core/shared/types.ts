export interface Entity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}