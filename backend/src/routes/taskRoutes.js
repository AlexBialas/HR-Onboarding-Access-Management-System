const express = require("express");

const router = express.Router();

const {
  createTask,
  getMyTasks,
  completeTask,
} = require("../controllers/taskController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createTask);

router.get("/my-tasks", protect, getMyTasks);

router.patch("/:id/complete", protect, completeTask);

module.exports = router;
