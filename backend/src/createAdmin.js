// Place this file inside backend/src/ (same folder as server.js and .env),
// then delete or move it out of source control after creating your admin.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@smartcivicportal.com"; // change this
const ADMIN_PASSWORD = "ChangeThisPassword123!"; // change this before running
const ADMIN_ROLE = "admin"; // or "superadmin"

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("A user with this email already exists:", existing.email);
      process.exit(0);
    }

    // Hash the password the same way registerUser does — your User model
    // has no pre-save hashing hook, so this must be done explicitly here.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: ADMIN_ROLE,
    });

    console.log("Admin user created:", admin.email, admin.role);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
};

run();