const express = require("express");

const router = express.Router();

const {
  createAccessRequest,
  getAllRequests,
} = require("../controllers/requestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, createAccessRequest);

router.get("/", protect, authorizeRoles("admin"), getAllRequests);

module.exports = router;
