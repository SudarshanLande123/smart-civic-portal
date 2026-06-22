const Complaint = require("../models/Complaint");
const { getIO } = require("../socket/socket");
const sendEmail = require("../utils/sendEmail");

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status",
      });
    }

    const complaint = await Complaint.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    await complaint.save();

    // Generic status-update email — non-fatal if it fails
    try {
      await sendEmail(
        complaint.createdBy.email,

        "Complaint Status Updated",

        `
    <h2>Status Updated</h2>

    <p>
    Your complaint status is:
    </p>

    <strong>
    ${status}
    </strong>
    `,
      );
    } catch (emailErr) {
      console.error("Status update email failed:", emailErr);
    }

    // Extra "Resolved" email — also non-fatal if it fails
    if (status === "Resolved") {
      try {
        await sendEmail(
          complaint.createdBy.email,
          "Complaint Resolved",
          `
      <h2>Good News! 🎉</h2>

      <p>Your complaint has been resolved.</p>

      <strong>${complaint.title}</strong>

      <br><br>

      <p>
        Thank you for helping improve the community through Smart Civic Portal.
      </p>

      <br>

      <p>
        Regards,<br>
        <strong>Sudarshan Lande</strong><br>
        Developer, Smart Civic Portal
      </p>
      `,
        );
      } catch (emailErr) {
        console.error("Resolved email failed:", emailErr);
      }
    }

    // Real-time notification — always runs now, regardless of email outcome
    const io = getIO();

    io.to(complaint.createdBy._id.toString()).emit("complaintStatusUpdated", {
      complaintId: complaint._id,
      status: complaint.status,
      message: `Your complaint is now ${complaint.status}`,
    });

    const Notification = require("../models/Notification");

    await Notification.create({
      user: complaint.createdBy._id,
      title: "Complaint Status Updated",
      message: `Your complaint is now ${complaint.status}`,
    });

    res.status(200).json({
      message: "Status updated successfully",
      complaint,
    });
  } catch (err) {
    console.error("updateComplaintStatus error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

//get all complaints to admin

const getAllComplaintAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getFilteredComplaints = async (req, res) => {
  try {
    const { category, status, location } = req.query;

    const filter = {};

    if (category) filter.category = category;

    if (status) filter.status = status;

    if (location)
      filter["location.address"] = {
        $regex: location,
        $options: "i",
      };

    const complaints = await Complaint.find(filter).populate(
      "createdBy",
      "name email",
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for the proof after completing complaint

const updateResolutionProof = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const uploadedFiles =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
        resourceType: file.mimetype,
      })) || [];

    complaint.proofMedia = uploadedFiles;

    complaint.resolutionNote = req.body.resolutionNote;

    complaint.resolvedAt = new Date();

    complaint.resolvedBy = req.user._id;

    complaint.status = "Resolved";

    await complaint.save();

    res.status(200).json({
      message: "Resolution Proof Uploaded",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  updateComplaintStatus,
  getAllComplaintAdmin,
  getFilteredComplaints,
  updateResolutionProof,
};
