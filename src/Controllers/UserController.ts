import Models from "../models/index";
import {
  userLoginSchema,
  sendInviteSchema,
  addUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../services/validation/userValidation";
import { messages } from "../services/messages";
import {
  errorResponseWithoutData,
  successResponseData,
  errorResponseData,
  successResponseWithoutData,
} from "../services/responses";
import {
  validPassword,
  generateAccessToken,
  generateInviteLinkToken,
  generateForgotPasswordToken,
} from "../services/helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendInviteHtml } from "../../view/sendInviteHtml";
import { forgotPasswordHTML } from "../../view/forgotPasswordHtml";
import bcrypt from "bcrypt";
import { emailTransport } from "../services/mailTransport";
import { Request, Response } from "express";

interface user extends Request {
  user: { id: number; username: string; email: string; password: string };
}

module.exports.userLogin = async (req: Request, res: Response) => {
  try {
    const validationResponse = userLoginSchema(req.body, res);
    if (validationResponse !== false) return;

    const { password } = req.body;

    const email = req.body.email.toLowerCase();

    const user = await Models.User.findOne({
      where: { email: email },
    });

    if (!user) {
      return errorResponseWithoutData(res, messages.userNotExist, 400);
    }

    const isPasswordValid = await validPassword(password, user);

    if (!isPasswordValid) {
      return errorResponseWithoutData(res, messages.incorrectCredentials, 400);
    }

    const accessToken = await generateAccessToken(user);

    const userData = {
      username: user.username,
      email: user.email,
      usertype: user.usertype,
    };

    return successResponseData(res, userData, 200, messages.userLoginSuccess, {
      token: accessToken,
    });
  } catch (error) {
    return errorResponseWithoutData(
      res,
      `${messages.somethingWentWrong}: ${error}`,
      400
    );
  }
};

module.exports.addUserByLink = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return errorResponseWithoutData(res, "Invalid Invite link", 400);
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return new Error("ACCESS_TOKEN_SECRET env variable not defined.");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    if (!decodedToken) {
      return errorResponseWithoutData(
        res,
        "Somthing went wrong while decoding token",
        500
      );
    }

    const inviteSender = await Models.User.findOne({
      where: { email: decodedToken.email },
    });

    if (!inviteSender) {
      return errorResponseWithoutData(
        res,
        "Invalid Invite link sender not found.",
        400
      );
    }

    const validationResponse = addUserSchema(req.body, res);
    if (validationResponse !== false) return;

    const { username, password } = req.body;

    const existedUser = await Models.User.findOne({
      where: {
        email: decodedToken.recieverEmail,
      },
    });

    if (existedUser) {
      return errorResponseWithoutData(
        res,
        "User with this email already exists.",
        400
      );
    }

    const user = await Models.User.create({
      username,
      email: decodedToken.recieverEmail,
      password,
      passwordChangeTime: Date.now(),
    });

    return successResponseData(
      res,
      user,
      400,
      "User created successfully by invite link."
    );
  } catch (error) {
    console.log(error);
    return errorResponseWithoutData(
      res,
      "User with this email already exists.",
      400
    );
  }
};

module.exports.sendInvite = async (req: user, res: Response) => {
  try {
    const validationResponse = sendInviteSchema(req.body, res);
    if (validationResponse !== false) return;

    const { recieverEmail } = req.body;

    const existedUser = await Models.User.findOne({
      where: {
        email: recieverEmail,
      },
    });

    if (existedUser) {
      return successResponseWithoutData(
        res,
        "User with this email already exists.",
        200
      );
    }

    const inviteLinkToken = await generateInviteLinkToken(
      req.user,
      recieverEmail
    );

    const link = `http://localhost:3003/v1/users/addUser?token=${inviteLinkToken}`;

    successResponseData(
      res,
      link,
      200,
      "Invite mail will be sent to the provided email id."
    );

    await emailTransport(
      req.user.email,
      recieverEmail,
      "Invite Link For InviteOnlyPlatform",
      sendInviteHtml(link)
    );
  } catch (error: any) {
    console.log(error);
    return errorResponseWithoutData(
      res,
      `Something went wrong while sending invite: ${error.message}`,
      400
    );
  }
};

module.exports.changePassword = async (req: user, res: Response) => {
  try {
    const validationResponse = changePasswordSchema(req.body, res);
    if (validationResponse !== false) return;

    const { oldPassword, newPassword } = req.body;

    const user = await Models.User.findOne({ where: { id: req.user.id } });

    const validOldPassword = await validPassword(oldPassword, user);

    if (!validOldPassword) {
      return errorResponseWithoutData(
        res,
        "Invalid old password, please provide correct old password",
        400
      );
    }

    user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    user.passwordChangeTime = Date.now();
    await user.save();

    const accessToken = await generateAccessToken(user);

    return successResponseData(
      res,
      null,
      200,
      "Password changed successfully.",
      {
        token: accessToken,
      }
    );
  } catch (error: any) {
    return errorResponseWithoutData(
      res,
      `Something went wrong while changing the password: ${error.message}`,
      400
    );
  }
};

module.exports.forgotPassword = async (req: Request, res: Response) => {
  try {
    const currentTime = Date.now();
    const { email } = req.body;

    const validationResponse = forgotPasswordSchema(req.body, res);
    if (validationResponse !== false) return;

    const user = await Models.User.findOne({ where: { email: email } });

    if (!user) {
      return errorResponseWithoutData(
        res,
        "User with this email does not exist.",
        400
      );
    }

    console.log(user.forgotPasswordTime);
    console.log(currentTime - user.forgotPasswordTime);

    if (
      user.forgotPasswordTime &&
      currentTime - user.forgotPasswordTime < 1000 * 60 * 60
    ) {
      return errorResponseWithoutData(
        res,
        "You have already requested a forgot password email within the last hour. Please try again later.",
        400
      );
    }

    const forgotPasswordToken = await generateForgotPasswordToken(email);

    const link = `http://localhost:3003/v1/users/resetPassword?token=${forgotPasswordToken}`;

    successResponseData(
      res,
      link,
      200,
      "Reset password mail will be sent to the provided email id."
    );

    user.forgotPasswordTime = currentTime;
    await user.save();

    await emailTransport(
      "taher.babuji@mindinventory.com",
      email,
      "Link for Reset Password",
      forgotPasswordHTML(link)
    );
  } catch (error: any) {
    return errorResponseData(
      res,
      "Something went wrong while changing forgotted password.",
      error
    );
  }
};

module.exports.resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return errorResponseWithoutData(
        res,
        "Invalid forgot password link.",
        400
      );
    }

    if (!process.env.INVITELINK_TOKEN_SECRET) {
      throw new Error("INVITELINK_TOKEN_SECRET env variable not defined");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.INVITELINK_TOKEN_SECRET
    ) as JwtPayload;

    if (!decodedToken) {
      return errorResponseWithoutData(
        res,
        "Somthing went wrong while decoding token",
        500
      );
    }

    const user = await Models.User.findOne({
      where: { email: decodedToken.email },
    });

    if (!user) {
      return errorResponseWithoutData(
        res,
        "Something went wrong while fetching user data.",
        400
      );
    }

    const validationResponse = resetPasswordSchema(req.body, res);
    if (validationResponse !== false) return;

    const { newPassword } = req.body;

    user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    user.forgotPasswordTime = null;
    user.passwordChangeTime = Date.now();
    user.save();

    return successResponseWithoutData(res, "Password reset successful.", 200);
  } catch (error: any) {
    return errorResponseData(
      res,
      "Something went wrong while resetting password.",
      error.message,
      400
    );
  }
};
