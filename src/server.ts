import express, { Request, Response, Router } from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import env from "./config";
import { tasks } from "./controllers";

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

  app.get("/tasks", tasks.getAll);
  app.get("/tasks/:id", tasks.getOne);
  app.post("/tasks", tasks.create);
  app.patch("/tasks/:id", tasks.update);
  app.delete("/tasks/:id", tasks.destroy);

  return app;
};
