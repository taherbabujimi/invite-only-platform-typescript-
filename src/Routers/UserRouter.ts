import { Router } from "express";
const { verifyJWT } = require("../Middlewares/authMiddleware");
const {
  userLogin,
  sendInvite,
  addUserByLink,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../Controllers/UserController");

const userRoute = Router();

userRoute.post("/login", userLogin);
userRoute.post("/sendInvite", verifyJWT, sendInvite);
userRoute.post("/addUser", addUserByLink);
userRoute.put("/changePassword", verifyJWT, changePassword);
userRoute.post("/forgotPassword", forgotPassword);
userRoute.post("/resetPassword", resetPassword);

module.exports = userRoute;
