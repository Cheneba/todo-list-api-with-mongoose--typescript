import mongoose, { Schema, Model, Document } from "mongoose";
import Joi from "joi";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  _id: { type: String },
  name: { type: mongoose.Schema.Types.String, required: true, min: 5, max: 45 },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
    min: 8,
    max: 64,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);

export const authValidators = Joi.object({
  _id: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(64),
});
