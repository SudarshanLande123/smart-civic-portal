const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {updateComplaintStatus,getAllComplaintAdmin,getFilteredComplaints,updateResolutionProof} = require("../controllers/adminController");
const upload = require("../middleware/uploadMiddleware");

router.get("/complaints",protect,authorize("admin","superadmin"),getAllComplaintAdmin);

router.get("/complaints/filter",protect,authorize("admin","superadmin"),getFilteredComplaints);

router.put("/status/:id",protect,authorize("admin","superadmin"),updateComplaintStatus);

//proof route

router.put("/proof/:id",protect,authorize("admin","superadmin"),upload.array("proofMedia", 5),updateResolutionProof);

module.exports = router;