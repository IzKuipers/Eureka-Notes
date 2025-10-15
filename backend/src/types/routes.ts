import { Request, Response, NextFunction } from "express";

export type RouteCallback = (
  req: Request,
  res: Response,
  stop: (s?: number) => string,
  next: NextFunction
) => void;

export type StopMethod = (c?: number) => void;
