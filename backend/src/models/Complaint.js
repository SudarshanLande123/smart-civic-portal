const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      address: String,

      // coordinates: {
      //   type: {
      //     type: String,
      //     enum: ["Point"],
      //     default: "Point",
      //   },

      //   coordinates: {
      //     type: [Number],
      //   },
    
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Submitted",
    },

    //for the Admin when Admin gets complaint the after he resolve that complaint he will upload image and othe info with it
    proofMedia: [
      {
        url: String,

        publicId: String,

        resourceType: String,
      },
    ],
    resolutionNote: {
      type: String,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    //for the cloudinary from user
    media: [
      {
        url: String,
        publicId: String,
        resourceType: String,
      },
    ],

    //for the voting to the complaint
    upVotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

//this is for the geoIndexing

// complaintSchema.index({
//   "location.coordinates": "2dsphere",
// });

// for the better search in mongoDb  search the document based on the index

// complaintSchema.index({
//   title: "text",
//   description: "text",
//   category: "text",
// });

module.exports = mongoose.model("Complaint", complaintSchema);
