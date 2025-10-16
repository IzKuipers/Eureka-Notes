export class ApiError extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = "ApiError";
  }
}
