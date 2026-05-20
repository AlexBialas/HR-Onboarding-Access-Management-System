const OnboardingTask = require("../models/OnboardingTask");

const asyncHandler = require("../middleware/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body || {};

  if (!title || !assignedTo) {
    res.status(400);

    throw new Error("Title and assigned user are required");
  }

  const task = await OnboardingTask.create({
    title,
    description,
    assignedTo,
    dueDate,
  });

  res.status(201).json(task);
});

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await OnboardingTask.find({
    assignedTo: req.user.id,
  }).sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

module.exports = {
  createTask,
  getMyTasks,
};
