const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Summary counts for the admin analytics dashboard
const getDashboardSummary = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const resolvedComplaints = await Complaint.countDocuments({
      status: "Resolved",
    });

    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ["Submitted", "Under Review", "In Progress"] },
    });

    const rejectedComplaints = await Complaint.countDocuments({
      status: "Rejected",
    });

    res.status(200).json({
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      rejectedComplaints,
    });
  } catch (error) {
    // Fixed: was catching as "err" but referencing "error" — now consistent
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCategoryStatistics = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStatusStatistics = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopProblemAreas = async (req, res) => {
  try {
    const areas = await Complaint.aggregate([
      {
        $group: {
          _id: "$location.address",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminPerformance = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      { $match: { status: "Resolved" } },
      {
        $group: {
          _id: "$resolvedBy",
          resolvedCount: { $sum: 1 },
        },
      },
      { $sort: { resolvedCount: -1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getCategoryStatistics,
  getStatusStatistics,
  getMonthlyTrends,
  getTopProblemAreas,
  getAdminPerformance,
};