require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const taskRoutes = require("./routes/taskRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/requests", requestRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("HR Onboarding API is running...");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
