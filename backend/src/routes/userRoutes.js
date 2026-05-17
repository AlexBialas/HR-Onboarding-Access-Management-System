const express = require("express");

const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const { getAllUsers } = require("../controllers/userController");

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

module.exports = router;
