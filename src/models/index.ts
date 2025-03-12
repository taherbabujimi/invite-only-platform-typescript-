"use strict";

import { Sequelize, DataTypes } from "sequelize";
import { sequelizeConfig } from "../config/config";
import User from "./user";

const env = process.env.NODE_ENV || "development";
const config = sequelizeConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

interface Database {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  [key: string]: any;
}

const db: Database = {
  sequelize,
  Sequelize: Sequelize,
};

db.User = User(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
