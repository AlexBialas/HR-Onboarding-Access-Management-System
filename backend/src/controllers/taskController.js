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

const getAllTasks = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const tasks = await OnboardingTask.find(filter)
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

const completeTask = asyncHandler(async (req, res) => {
  const task = await OnboardingTask.findById(req.params.id);

  if (!task) {
    res.status(404);

    throw new Error("Task not found");
  }

  task.status = "completed";
  task.completedAt = new Date();

  await task.save();

  res.status(200).json({
    message: "Task completed",
    task,
  });
});

const getTaskStats = asyncHandler(async (req, res) => {
  const totalTasks = await OnboardingTask.countDocuments();

  const completedTasks = await OnboardingTask.countDocuments({
    status: "completed",
  });

  const pendingTasks = await OnboardingTask.countDocuments({
    status: "pending",
  });

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.status(200).json({
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
  });
});

module.exports = {
  createTask,
  getMyTasks,
  getAllTasks,
  completeTask,
  getTaskStats,
};
