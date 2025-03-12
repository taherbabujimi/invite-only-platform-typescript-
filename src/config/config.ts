import { Dialect } from "sequelize";

const result = require("dotenv").config();

if (result.error) {
  throw result.error;
}

interface SequelizeConfig {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
  };
}

if (
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_DATABASE ||
  !process.env.DB_HOST
) {
  throw new Error("One of the environment variables for config is not set.");
}

export const sequelizeConfig: SequelizeConfig = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
