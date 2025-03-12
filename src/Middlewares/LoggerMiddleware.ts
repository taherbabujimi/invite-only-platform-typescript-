import { Request, Response, NextFunction } from "express";

const LoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Here we can access and modify the request and response object before it gets to the main controller function
  console.log("Logging from middleware");
  next();
};

module.exports = { LoggerMiddleware };
