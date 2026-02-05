
export type Callable<T> = { (...args: any[]): T };

export interface CommandResultOptions {
  error?: Error;
  errorMessage?: string;
  successMessage?: string;
  success?: boolean;
}

export const DefaultCommandResultOptions: CommandResultOptions = {};
