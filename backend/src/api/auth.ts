import { Request } from "express";
import { ValidateToken } from "../db/token";

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AuthorizationError";
  }
}

export class RequirementError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "RequirementError";
  }
}

export async function AssumeAuthorization(req: Request) {
  if (!req.headers.authorization)
    throw new AuthorizationError("Missing authorization header");

  const [type, token] = req.headers.authorization.split(" ");

  if (type !== "Bearer" || !token)
    throw new AuthorizationError("Invalid authorization header");

  const user = await ValidateToken(token);

  if (!user) throw new AuthorizationError("Invalid token");

  return user;
}

export function AssumeNoAuthorization(req: Request) {
  if (req.headers.authorization)
    throw new AuthorizationError(
      "Can't access this endpoint with authorization"
    );
}
