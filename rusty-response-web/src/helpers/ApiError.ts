export default class ApiError extends Error {
  status: number;
  details?: string | null;

  constructor(message: string, status: number, details?: string | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}