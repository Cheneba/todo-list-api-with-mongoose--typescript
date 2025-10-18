import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.includes("Bearer ")) {
    return res
      .status(404)
      .json({ message: "Authorization header missing or invalid format" });
  }

  const token = auth.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  if (!env.jwt_key) {
    return res.json({
      message: "Unable to Authorize at the moment, try later!",
    });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, env.jwt_key);
  } catch (error) {}

  if (!decoded || !decoded._id) {
    res.status(401).json({
      message: "Invalid token payload",
    });
  }

  const user = await User.findById(decoded._id);

  req.user = user;
  next();
};
