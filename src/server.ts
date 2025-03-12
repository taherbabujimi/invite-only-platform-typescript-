import Express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

const IndexRoute = require("./Routers/IndexRoute");

const app = Express();
dotenv.config();

const port = process.env.PORT || 7000;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  next();
});

app.use("/", IndexRoute);

app.listen(port, () => {
  console.log("Server started on port ", port);
  console.log("DB connected to ", process.env.DB_HOST);
});
