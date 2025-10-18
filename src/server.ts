import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import env from "./config";
import { tasks } from "./controllers";
import { auth } from "./controllers";
import { authMiddleware } from "./middleware/authMiddleware";

export const createServer = () => {
  const app = express();

  // Loading dependencies
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors());

  mongoose
    .connect(env.mongo_db_connection || "")
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log("Error: " + err.message));

  // Routes
  app.get("/", (req: Request, res: Response) => {
    res.redirect("/tasks");
  });

  // Auth endpoints
  app.post("/register", auth.register);
  app.post("/login", auth.login);
  app.get("/home", authMiddleware, auth.home);

  // Tasks endpoints
  app.get("/tasks", authMiddleware, tasks.getAll);
  app.get("/tasks/:id", authMiddleware, tasks.getOne);
  app.post("/tasks", authMiddleware, tasks.create);
  app.patch("/tasks/:id", authMiddleware, tasks.update);
  app.delete("/tasks/:id", authMiddleware, tasks.destroy);

  return app;
};
