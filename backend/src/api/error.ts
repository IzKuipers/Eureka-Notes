import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { Logger } from "../logging";

// Custom error handling middleware
const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof Error.CastError || err instanceof Error.ValidationError) {
    return res.status(400);
  }

  Logger.error(`An error occured: ${err}`);

  return res.status(500);
};

export default errorHandler;

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
    constructor(message: string) {
    super(message);

    this.name = "ConflictError";
  }
}
