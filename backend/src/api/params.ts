import { RequirementError } from "./auth";
import { Request } from "express";

export function RequireDefined(req: Request, ...fields: string[]) {
  const values: any[] = [];

  for (const field of fields) {
    if (!req.body[field])
      throw new RequirementError(`Required field ${field} is missing`);

    values.push(req.body[field]);
  }

  return values;
}

export function RequireContentType(req: Request, type: string) {
  if (req.headers["content-type"]?.toLowerCase() !== type.toLowerCase())
    throw new RequirementError(`Content type has to be ${type}`);
}
