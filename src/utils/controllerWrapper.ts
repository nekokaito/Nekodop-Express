import type { Request, Response, NextFunction } from "express";

export type Controller = (context: {
  req: Request;
  res: Response;
}) => Promise<void>;

export const wrap = (controller: Controller) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller({ req, res }).catch(next);
  };
};
