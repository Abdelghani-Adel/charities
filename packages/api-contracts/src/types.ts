export interface ApiResponse<T> {
  status: "success";
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  status: "error";
  message: string;
  code: string;
  correlationId: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}
