type ApiResponse<T> = {
  status: number;
  message: string;
  result: T;
};

export type { ApiResponse };