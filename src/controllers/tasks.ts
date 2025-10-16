import express, { Request, Response, Router } from "express";
import { Task, taskValidator } from "../models";
import EntityNotFoundError from "../errors/EntityNotFoundError";

export const getAll = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});
    throw new Error("oops");
    res.json({ count: tasks.length, tasks: tasks });
  } catch (error) {
    let message = "Something went wrong! Try again later.";
    if (error instanceof Error) {
      message = error.message;
    }
    throw new EntityNotFoundError({
      customMessage: message,
      statusCode: 404,
      code: "ERR_NF",
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  taskValidator.validate({ id: req.params.id });
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ task: task });
};

export const create = async (req: Request, res: Response) => {
  console.log(req.body);
  // Validates parameters
  const params = {
    title: req.body?.title,
    description: req.body?.description,
    status: req.body?.status,
    priority: req.body?.priority,
    dueDate: req.body?.dueDate,
    completed: req.body?.completed,
  };
  taskValidator.validate(params);

  // Create task object
  const task = new Task({
    title: req.body?.title,
    description: req.body?.description,
    status: req.body?.status,
    priority: req.body?.priority,
    dueDate: req.body?.dueDate,
    completed: req.body?.completed,
  });

  const newTask = await task.save();

  res.json({ task: newTask, message: "Task Created" });
};

export const update = async (req: Request, res: Response) => {
  const params: Record<string, any> = {};
  if (req.body?.title) params.title = req.body.title;
  if (req.body?.description) params.description = req.body.description;
  if (req.body?.status) params.status = req.body.status;
  if (req.body?.priority) params.priority = req.body.priority;
  if (req.body?.dueDate) params.dueDate = req.body.dueDate;
  if (req.body?.completed) params.completed = req.body.completed;

  // Update task
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Update values
  Object.keys(params).forEach((param) => {
    (task as any)[param] = params[param];
  });

  // Save updates
  await task.save();

  res.json({ task: task, message: "Task Updated" });
};

export const destroy = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task Deleted" });
};
