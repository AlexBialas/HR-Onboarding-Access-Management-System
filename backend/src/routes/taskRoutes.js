const express = require("express");

const router = express.Router();

const { createTask, getMyTasks } = require("../controllers/taskController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("admin"), createTask);

router.get("/my-tasks", protect, getMyTasks);

module.exports = router;
