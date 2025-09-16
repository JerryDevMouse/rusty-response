export default class ApiError extends Error {
  status: number;
  details?: string | null;

  constructor(message: string, status: number, details?: string | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  public log(): void {
    console.log('Server error: ', this.message);
    console.log('Error status: ', this.status);
    if (this.details) console.log('Error details: ', this.details);
  }
}