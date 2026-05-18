const express = require("express");

const router = express.Router();

const {
  createAccessRequest,
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, createAccessRequest);

router.get("/", protect, authorizeRoles("admin"), getAllRequests);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateRequestStatus
);

module.exports = router;
