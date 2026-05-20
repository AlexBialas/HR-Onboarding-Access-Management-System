const AccessRequest = require("../models/AccessRequest");

const createAccessRequest = async (req, res) => {
  try {
    const { systemName, accessType, reason } = req.body;

    const request = await AccessRequest.create({
      employee: req.user.id,
      systemName,
      accessType,
      reason,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find()
      .populate("employee", "name email role")
      .populate("approvedBy", "name email");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({
      employee: req.user.id,
    })
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status, approvalComment } = req.body;

    const request = await AccessRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
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
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAccessRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
};
