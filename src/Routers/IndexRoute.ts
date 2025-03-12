import { Router } from "express";
const userRoute = require("../Routers/UserRouter");
const { LoggerMiddleware } = require("../Middlewares/LoggerMiddleware");
const IndexRoute = Router();

IndexRoute.use("/v1/users", LoggerMiddleware, userRoute);

module.exports = IndexRoute;
