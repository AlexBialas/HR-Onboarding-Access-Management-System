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

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body || {};

  const task = await OnboardingTask.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  res.status(200).json({
    message: "Task updated",
    task,
  });
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

const deleteTask = asyncHandler(async (req, res) => {
  const task = await OnboardingTask.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.status(200).json({
    message: "Task deleted",
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

const getEmployeeProgress = asyncHandler(async (req, res) => {
  const progress = await OnboardingTask.aggregate([
    {
      $group: {
        _id: "$assignedTo",
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    {
      $unwind: "$employee",
    },
    {
      $project: {
        employee: "$employee.name",
        totalTasks: 1,
        completedTasks: 1,
        completionRate: {
          $round: [
            {
              $multiply: [
                {
                  $divide: ["$completedTasks", "$totalTasks"],
                },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  res.status(200).json(progress);
});

module.exports = {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  completeTask,
  deleteTask,
  getTaskStats,
  getEmployeeProgress,
};
