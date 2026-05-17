const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    systemName: {
      type: String,
      required: true,
    },

    accessType: {
      type: String,
      enum: ["read", "write", "admin"],
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AccessRequest", accessRequestSchema);
