const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

//registration function

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User Already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //for sending the email

    sendEmail(
      user.email,
      "Welcome to Civic Portal",
      `
        <h2>Welcome ${user.name}!</h2>
        <p>Thank you for registering on Smart Civic Portal.</p>
        <p>We are glad to have you as a member of our community.</p>
        <br>
        <p>Regards,<br><strong>Sudarshan Lande</strong><br>Developer, Smart Civic Portal</p>
      `,
    ).catch((err) => {
      console.error("Welcome email failed:", err.message);
    });
    res.status(201).json({
      message: "User Registered Succeessfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// login function

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account has been deactivated!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
