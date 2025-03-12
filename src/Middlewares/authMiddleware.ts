import jwt, { JwtPayload } from "jsonwebtoken";
import {
  errorResponseWithoutData,
  errorResponseData,
} from "../services/responses";
import { messages } from "../services/messages";
import { Request, Response, NextFunction } from "express";
import Models from "../models/index";
import { UserRequest } from "../services/interfaces";

module.exports = {
  async verifyJWT(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return errorResponseWithoutData(res, messages.badRequest, 400);
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
        return new Error("ACCESS_TOKEN_SECRET env variable not defined.");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as JwtPayload;

      const user = await Models.User.findByPk(decodedToken.id);

      if (!user) {
        return errorResponseWithoutData(res, messages.invalidToken, 400);
      }

      if (decodedToken.issueDate < user.passwordChangeTime) {
        return errorResponseWithoutData(
          res,
          "Your password has been changed, please login again",
          400
        );
      }

      const userReq = req as UserRequest;

      userReq.user = user;

      next();
    } catch (error: any) {
      return errorResponseData(res, messages.invalidToken, error);
    }
  },
};
