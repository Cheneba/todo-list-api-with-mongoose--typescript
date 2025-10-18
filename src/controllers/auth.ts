import express, { Request, Response } from "express";
import { authValidators, User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config";

export const home = (req: Request, res: Response) => {
  res.send("Hello User, Welcome to my Platform");
};

export const login = async (req: Request, res: Response) => {
  // process inputs
  const { name, email, password } = req.body;

  if (!email) {
    return res.json({ message: "Error: Email is needed!" });
  }

  const params: Record<string, any> = {};
  if (name) params.name = name;
  if (email) params.email = email;
  if (password) params.password = password;

  // validate inputs
  authValidators.validate(params);

  // Get user
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ message: "User not found!" });
  }
  // compare passwords
  const result = await bcrypt.compare(password, user.password);
  console.log(result);
  // generate jwt token and return if true, if not, throw error
  if (!env.jwt_key) {
    return res.json({ message: "Unable to login, try again later!" });
  }

  const token = jwt.sign(
    { _id: user._id, name: user.name },
    env.jwt_key
    // {expiresIn: '3h'}
  );
  res.json({ token: token });
};

export const register = async (req: Request, res: Response) => {
  // process inputs
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    return res.json({
      message: "Error: name, email and password are required",
    });
  }
  // validate inputs
  authValidators.validate({ name: name, email: email, password: password });

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user and save
  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  await user.save();

  // generate token for user and return
  if (!env.jwt_key) {
    return res.json({ user: user });
  }

  const token = jwt.sign({ _id: user._id, name: user.name }, env.jwt_key);

  return res.json({ token: token, user: user });
};
