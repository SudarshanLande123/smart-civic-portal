const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
console.log(upload);
const {createComplaint,getAllComplaints,getComplaintById,updateComplaint,deleteComplaint,toggleUpvotes,getUpvoteCount, searchComplaints, filterComplaint,getnearByComplaints,getHeatMapData} = require("../controllers/complaintController");


router.post("/",protect,upload.array("media", 5),createComplaint);

router.get("/",getAllComplaints);



router.put("/:id",protect,updateComplaint);

router.delete("/:id",protect,deleteComplaint);

router.put("/upvote/:id",protect,toggleUpvotes);

router.get("/upvotes/:id",getUpvoteCount);

router.get("/search",searchComplaints);

router.get("/filter",filterComplaint);

router.get("/nearby",getnearByComplaints);

router.get("/heatmap",getHeatMapData);

router.get("/:id",getComplaintById);

module.exports = router;