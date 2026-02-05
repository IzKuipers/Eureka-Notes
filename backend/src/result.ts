import { BaseError } from "./api/error/classes";
import { CommandResultOptions, DefaultCommandResultOptions } from "./types/result";

export class CommandResult<T = string> {
  public result: T | undefined;
  public error?: Error;
  public errorMessage?: string;
  public successMessage?: string;
  public success = false;

  constructor(result?: T, options: CommandResultOptions = DefaultCommandResultOptions) {
    this.result = result;
    this.successMessage = options.successMessage;
    this.errorMessage = options.errorMessage;
    this.error = options.error;
    this.success = options.success ?? false;
  }

  static Ok<T>(value: T, successMessage?: string) {
    return new this<T>(value, { success: true, successMessage });
  }

  static Error<T, E extends BaseError = BaseError>(errorMessage: string, errorClass?: E) {
    errorClass ||= Error as any;

    return new this<T>(undefined, { error: new errorClass!(errorMessage), errorMessage });
  }
}
