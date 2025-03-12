import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface user {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const generateHash = async (password: string) => {
  return await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const validPassword = async (givenPassword: string, user: user) => {
  return await bcrypt.compare(givenPassword, user.password);
};

export const generateAccessToken = async (user: user) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return new Error("ACCESS_TOKEN_SECRET environment variable is not set");
  }

  return await jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      issueDate: Date.now(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const generateInviteLinkToken = async (
  user: user,
  recieverEmail: string
) => {
  if (!process.env.INVITELINK_TOKEN_SECRET) {
    return new Error("INVITELINK_TOKEN_SECRET environment variable is not set");
  }

  return await jwt.sign(
    {
      email: user.email,
      recieverEmail: recieverEmail,
    },
    process.env.INVITELINK_TOKEN_SECRET,
    {
      expiresIn: process.env.INVITELINK_TOKEN_EXPIRY,
    }
  );
};

export const generateForgotPasswordToken = async (email: string) => {
  if (!process.env.INVITELINK_TOKEN_SECRET) {
    return new Error("INVITELINK_TOKEN_SECRET environment variable is not set");
  }

  return await jwt.sign(
    {
      email: email,
    },
    process.env.INVITELINK_TOKEN_SECRET,
    {
      expiresIn: process.env.INVITELINK_TOKEN_EXPIRY,
    }
  );
};
