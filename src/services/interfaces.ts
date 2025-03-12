import { Model } from "sequelize";
import { Request } from "express";
import { Dialect } from "sequelize";

export interface ResponseMeta {
  code: number;
  message: string;
  [key: string]: any;
}

export interface ResponseData<T> {
  data: T;
  meta: ResponseMeta;
}

export interface user {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  forgotPasswordTime?: Date;
  passwordChangeTime?: Date;
}

export interface UserInstance
  extends Model<UserAttributes, UserAttributes>,
    UserAttributes {}

export interface UserRequest extends Request {
  user: Object;
}

export interface UserController extends Request {
  user: { id: number; username: string; email: string; password: string };
}

export interface SequelizeConfig {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
  };
}
