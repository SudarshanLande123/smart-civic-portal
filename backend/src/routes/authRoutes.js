const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");
const {registerValidation}  = require("../validators/authValidator");
const {validate} = require("../middleware/validateMiddleware");
const protect = require("../middleware/authMiddleware");
const router = express.Router();    


router.post("/register",registerValidation,validate,registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

module.exports = router;
