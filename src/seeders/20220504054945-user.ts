import bcrypt from "bcrypt";
import { QueryInterface } from "sequelize";

const generateHash = async (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "Taher Babuji",
          email: "babujitaher7@gmail.com",
          password: await generateHash("taher"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("users", {}, {});
  },
};
