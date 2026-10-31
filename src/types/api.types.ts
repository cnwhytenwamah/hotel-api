export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  path?: string;
  timestamp?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}