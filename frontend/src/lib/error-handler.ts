import { AxiosError } from 'axios';
import { isAppError } from './custom-error';

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  // Handle AppError
  if (isAppError(error)) {
    return error.message || defaultMessage;
  }
  
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    
    // Handle validation errors
    if (errorData?.errors) {
      const validationErrors = Object.values(errorData.errors).flat();
      return validationErrors.join(', ');
    }
    
    // Handle custom error messages from the API
    if (errorData?.message) {
      return errorData.message;
    }
    
    // Handle HTTP status codes
    if (error.response?.status === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.status === 404) {
      return 'Resource not found.';
    }
    if (error.response?.status === 409) {
      return 'This email is already registered.';
    }
    if (error.response?.status === 422) {
      return 'Validation failed. Please check your input.';
    }
    if (error.response?.status === 429) {
      return 'Too many requests. Please try again later.';
    }
    
    // Return the error message or a default
    return error.message || defaultMessage;
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return defaultMessage;
}

export function getErrorDetails(error: unknown): { 
  message: string; 
  statusCode?: number; 
  errors?: Record<string, string[]>;
  originalError?: unknown;
} {
  // Handle AppError
  if (isAppError(error)) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      originalError: error.originalError,
    };
  }
  
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    return {
      message: errorData?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      errors: errorData?.errors,
      originalError: error,
    };
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An error occurred',
      originalError: error,
    };
  }
  
  return {
    message: 'An error occurred',
  };
}

export function isValidationError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.statusCode === 400 && !!(error as any).responseData?.errors;
  }
  
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    return error.response?.status === 400 && !!errorData?.errors;
  }
  return false;
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isAppError(error)) {
    const responseData = (error as any).responseData as ApiErrorResponse;
    return responseData?.errors || null;
  }
  
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse;
    if (error.response?.status === 400 && errorData?.errors) {
      return errorData.errors;
    }
  }
  return null;
}

export function isAuthenticationError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.statusCode === 401;
  }
  
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

export function isForbiddenError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.statusCode === 403;
  }
  
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
}