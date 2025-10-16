import { Request } from "express";
import { ValidateToken } from "../db/token";
import { ExistingEurekaUser } from "../types/model/user";

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

/**
 * A function that validates the token associated with the request, throwing an error if it's invalid
 * @param req The Express Request
 * @returns An existing Eureka user
 */
export async function AssumeAuthorization(req: Request): Promise<ExistingEurekaUser> {
  const token = GetTokenFromRequest(req);
  const user = await ValidateToken(token);

  if (!user) throw new AuthorizationError("Invalid token");

  return user;
}

/**
 * A function that throws an error if credentials were sent in the request
 * @param req The Express Request
 */
export function AssumeNoAuthorization(req: Request) {
  if (req.headers.authorization) throw new AuthorizationError("Can't access this endpoint with authorization");
}

/**
 * A function that returns the token of a request, throwing an error if it's not there
 * @param req The Express Request
 * @returns the token
 */
export function GetTokenFromRequest(req: Request) {
  if (!req.headers.authorization) throw new AuthorizationError("Missing authorization header");

  const [type, token] = req.headers.authorization.split(" ");

  if (type !== "Bearer" || !token) throw new AuthorizationError("Invalid authorization header");

  return token;
}
