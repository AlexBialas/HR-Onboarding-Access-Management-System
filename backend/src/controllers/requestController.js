const AccessRequest = require("../models/AccessRequest");

const asyncHandler = require("../middleware/asyncHandler");

const createAccessRequest = asyncHandler(async (req, res) => {
  const { systemName, accessType, reason } = req.body || {};

  if (!systemName || !accessType || !reason) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const request = await AccessRequest.create({
    employee: req.user.id,
    systemName,
    accessType,
    reason,
  });

  res.status(201).json(request);
});

const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await AccessRequest.find()
    .populate("employee", "name email role")
    .populate("approvedBy", "name email");

  res.status(200).json(requests);
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await AccessRequest.find({
    employee: req.user.id,
  })
    .populate("approvedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(requests);
});

const getRequestStats = asyncHandler(async (req, res) => {
  const totalRequests = await AccessRequest.countDocuments();

  const approvedRequests = await AccessRequest.countDocuments({
    status: "approved",
  });

  const pendingRequests = await AccessRequest.countDocuments({
    status: "pending",
  });

  const rejectedRequests = await AccessRequest.countDocuments({
    status: "rejected",
  });

  res.status(200).json({
    totalRequests,
    approvedRequests,
    pendingRequests,
    rejectedRequests,
  });
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, approvalComment } = req.body || {};

  const request = await AccessRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = status;

  request.approvalComment = approvalComment;

  request.approvedBy = req.user.id;

  request.approvedAt = new Date();

  await request.save();

  res.status(200).json({
    message: "Request status updated",
    request,
  });
});

module.exports = {
  createAccessRequest,
  getAllRequests,
  getMyRequests,
  getRequestStats,
  updateRequestStatus,
};
