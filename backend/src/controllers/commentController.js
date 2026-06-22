const Complaint = require("../models/Complaint");
const Comment = require("../models/Comment");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const complaint = await Complaint.findById(req.params.complaintId);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }
    const comment = await Comment.create({
      complaint: req.params.complaintId,

      user: req.user._id,

      text,
    });

    res.status(201).json({
      message: "Comment added successfully",

      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//get all comments of complaint

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaint: req.params.complaintId })
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// to delete comment 

const deleteComment = async(req,res)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);


        if (!comment) {
        return res.status(404).json({
            message:
                "Comment not found"
            });
        }

    const isOwner = comment.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if(!isOwner && !isAdmin){
        return res.status(403).json({
        message:
          "Not authorized"
      });
    }

    await comment.deleteOne();
    
    res.status(200).json({
      message:
        "Comment deleted"
    });


    }catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }
};

module.exports = {
    addComment,
    getAllComments,
    deleteComment
};
