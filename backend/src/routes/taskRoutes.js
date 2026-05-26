const express = require("express");

const router = express.Router();

const {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  completeTask,
  deleteTask,
  getTaskStats,
  getEmployeeProgress,
} = require("../controllers/taskController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createTask);

router.get("/", protect, authorizeRoles("admin"), getAllTasks);

router.get("/my-tasks", protect, getMyTasks);

router.get("/stats", protect, authorizeRoles("admin"), getTaskStats);

router.get("/progress", protect, authorizeRoles("admin"), getEmployeeProgress);

router.put("/:id", protect, authorizeRoles("admin"), updateTask);

router.patch("/:id/complete", protect, completeTask);

router.delete("/:id", protect, authorizeRoles("admin"), deleteTask);

module.exports = router;
