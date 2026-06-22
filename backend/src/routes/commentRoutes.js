const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { addComment, getAllComments, deleteComment } = require("../controllers/commentController");

//to add comments
router.post("/complaint/:complaintId",protect,addComment);

//for all comments of particular complaint
router.get("/complaint/:complaintId",getAllComments);

//for deleting comment
router.delete("/:commentId",protect,deleteComment);

module.exports = router;
