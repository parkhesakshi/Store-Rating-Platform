export class AppError extends Error {
  public readonly statusCode?: number;
  public readonly responseData?: unknown;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      responseData?: unknown;
      originalError?: unknown;
    }
  ) {
    super(message);
    this.name = 'AppError';
    
    this.statusCode = options?.statusCode;
    this.responseData = options?.responseData;
    this.originalError = options?.originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  override toString(): string {
    return `AppError: ${this.message} (Status: ${this.statusCode || 'N/A'})`;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      responseData: this.responseData,
      stack: this.stack,
    };
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}