import mongoose, { Schema, Model, Document } from "mongoose";
import Joi from "joi";

interface ITask {
  id: Schema.Types.ObjectId;
  title: String;
  description: String;
  status: String;
  priority: String;
  dueDate: Schema.Types.Date;
  createdAt: Schema.Types.Date;
  updatedAt: Schema.Types.Date;
  completed: Schema.Types.Boolean;
  completedAt: Schema.Types.Date;
}

const taskSchema = new Schema<ITask>({
  id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, required: false, maxLength: 150 },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  dueDate: { type: Schema.Types.Date, required: false },
  createdAt: { type: Schema.Types.Date, default: Date.now() },
  updatedAt: { type: Schema.Types.Date, required: false },
  completed: { type: Schema.Types.Boolean, required: false },
  completedAt: { type: Schema.Types.Date, required: false },
});

export const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export const taskValidator = Joi.object({
  id: Joi.string(),
  title: Joi.string().min(4).max(45),
  description: Joi.string().max(150),
  status: Joi.string().valid(
    "pending",
    "in-progress",
    "completed",
    "cancelled"
  ),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.date(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  completed: Joi.boolean(),
  completedAt: Joi.date(),
});
