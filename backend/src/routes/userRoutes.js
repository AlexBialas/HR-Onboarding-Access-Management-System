const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
});

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.put("/:id/role", protect, authorizeRoles("admin"), updateUserRole);

module.exports = router;
