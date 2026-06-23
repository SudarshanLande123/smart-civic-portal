const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

const createComplaint = async (req, res) => {
  try {
    const uploadedFiles =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
        resourceType: file.mimetype,
      })) || [];

    const { title, description, category, address: location } = req.body;

    const duplicateComplaint = await detectDuplicateComplaint(
      title,
      category,
      location,
    );

    if (duplicateComplaint) {
      return res.status(409).json({
        message: "Similar complaint already exists",
        complaintId: duplicateComplaint._id,
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: {
        address: location,
      },
      media: uploadedFiles,
      createdBy: req.user._id,
    });

    console.log("Location from req.body:", location);

    // Non-blocking email
    sendEmail(
      req.user.email,
      "Complaint Submitted",
      `
  <h2>Complaint Submitted</h2>
  <p>Your complaint has been submitted successfully.</p>
  <strong>Complaint: ${complaint.title}</strong>
  <br><br>
  <p>Developed by Sudarshan</p>
  `,
    ).catch((err) => {
      console.error("Complaint submission email failed:", err.message);
    });

    res.status(201).json({
      message: "Complaint created Successfully",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
//get all complaints

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .sort({
        upVotes: -1,
        createdAt: -1,
      });
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get single complaint
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    await Notification.create({
      user: complaint.createdBy,
      title: "Complaint Status Updated",
      message: `Your complaint is now ${updatedComplaint.status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// for the upvotes

const toggleUpvotes = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyUpvoted = complaint.upVotes.some(
      (id) => id.toString() === userId,
    );

    if (alreadyUpvoted) {
      complaint.upVotes = complaint.upVotes.filter(
        (id) => id.toString() !== userId,
      );
    } else {
      complaint.upVotes.push(req.user._id);
    }

    await complaint.save();

    res.status(200).json({
      totalUpvotes: complaint.upVotes.length,

      upvoted: !alreadyUpvoted,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//for total count of upvotes

const getUpvoteCount = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      totalUpvotes: complaint.upVotes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchComplaints = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const complaint = await Complaint.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          category: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          "location.address": {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// for filtering the complaint based on the status location date

const filterComplaint = async (req, res) => {
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

    const complaints = await Complaint.find(filter);

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { searchComplaints, filterComplaint };

//delete the duplicate Complaint

const detectDuplicateComplaint = async (title, category, address) => {
  return await Complaint.findOne({
    category,
    title: { $regex: title, $options: "i" },
    "location.address": { $regex: address, $options: "i" },
  });
};
// for the nearby complaints from user

const getnearByComplaints = async (req, res) => {
  try {
    const { latitude, longitude, raduis } = req.body;

    const complaints = await Complaint.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",

            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: Number(raduis) * 1000,
        },
      },
    });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//for the complaint in area using heatmap

const getHeatMapData = async (req, res) => {
  try {
    const complaints = await Complaint.find(
      {},
      {
        location: 1,
      },
    );

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  toggleUpvotes,
  getUpvoteCount,
  searchComplaints,
  filterComplaint,
  getnearByComplaints,
  getHeatMapData,
};
