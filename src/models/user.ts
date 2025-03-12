import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

// Define interfaces for the User attributes
interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
  forgotPasswordTime?: Date;
  passwordChangeTime?: Date;
}

// Interface for the instance methods
interface UserInstance
  extends Model<UserAttributes, UserAttributes>,
    UserAttributes {}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class User
    extends Model<UserAttributes, UserAttributes>
    implements UserAttributes
  {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public forgotPasswordTime?: Date;
    public passwordChangeTime?: Date;
  }

  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      forgotPasswordTime: {
        type: dataTypes.DATE,
      },
      passwordChangeTime: {
        type: dataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  User.beforeCreate(async (user: UserInstance, options) => {
    return await bcrypt
      .hash(user.password, 10)
      .then((hash: string) => {
        user.password = hash;
      })
      .catch((err: Error) => {
        throw new Error();
      });
  });

  return User;
};
