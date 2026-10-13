export type AdminActionResult = { error?: string; fieldErrors?: Record<string, string[]> };

export class AdminValidationError extends Error {
  constructor(message: string, public fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'AdminValidationError';
  }
}
