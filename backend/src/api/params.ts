import { Request } from "express";
import { RequirementError } from "./auth";

/**
 * A method to get required fields from a request body, erroring if one of them can't be found.
 * @param req The ExpressJS request
 * @param fields The fields to check
 * @returns The array of fields in the same order as the input.
 * @throws {RuntimeError} if a field is missing
 */
export function RequireDefined<T = any[]>(req: Request, ...fields: string[]) {
  const values: any[] = [];

  for (const field of fields) {
    if (req.body[field] === undefined) throw new RequirementError(`Required field ${field} is missing`);

    values.push(req.body[field]);
  }

  return values as T;
}

/**
 * A method to get optional fields from a request body, subsituting any missing fields with empty strings.
 * @param req The ExpressJS request
 * @param fields The fields to check
 * @returns The array of field values in the same order as the input.
 */
export function MaybeDefined<T = any[]>(req: Request, ...fields: string[]) {
  const values: any[] = [];

  for (const field of fields) {
    values.push(req.body[field] ?? "");
  }

  return values as T;
}

/**
 * A method to get required parameters from req.params, erroring if one of them can't be found.
 * @param req The ExpressJS request
 * @param params The params to check
 * @returns The array of param values in the same order as the input.
 * @throws {RuntimeError} if a field is missing
 */
export function RequireDefinedParam<T = any[]>(req: Request, ...params: string[]) {
  const values: any[] = [];

  for (const param of params) {
    if (req.params[param] === undefined) throw new RequirementError(`Required parameter ${param} is missing`);

    values.push(req.params[param]);
  }

  return values as T;
}

/**
 * This method throws an error if the request's content type does not match
 * @param req The ExpressJS request
 * @param type The required content type
 */
export function RequireContentType(req: Request, type: string) {
  if (req.headers["content-type"]?.toLowerCase() !== type.toLowerCase())
    throw new RequirementError(`Content type has to be ${type}`);
}
