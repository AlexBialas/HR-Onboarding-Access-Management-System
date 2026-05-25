const express = require("express");

const router = express.Router();

const {
  createTask,
  getMyTasks,
  getAllTasks,
  completeTask,
  getTaskStats,
} = require("../controllers/taskController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createTask);

router.get("/", protect, authorizeRoles("admin"), getAllTasks);

router.get("/my-tasks", protect, getMyTasks);

router.get("/stats", protect, authorizeRoles("admin"), getTaskStats);

router.patch("/:id/complete", protect, completeTask);

module.exports = router;
