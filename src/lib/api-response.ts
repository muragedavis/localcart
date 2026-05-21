export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const successResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const errorResponse = (error: string, message?: string): ApiResponse => {
  return {
    success: false,
    error,
    message: message || error,
  };
};
