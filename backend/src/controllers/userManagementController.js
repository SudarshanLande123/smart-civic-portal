const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = false;

    await user.save();

    res.status(200).json({
      message: "User deactivated",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//update user role

const updateUserRole = async (req, res) => {
  try {
    const allowedRoles = ["citizen", "admin", "superadmin"];
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Role is not defined!",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      message: "Role updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = true;

    await user.save();

    res.status(200).json({
      message: "User activated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserStatistic = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();

    const activeUser = await User.countDocuments({
      isActive: true,
    });

    const deactiveUser = await User.countDocuments({
      isActive: false,
    });

    const admins = await User.countDocuments({
      role: "admin",
    });

    const citizens = await User.countDocuments({
      role: "citizen",
    });

    res.status(200).json({
      totalUser,
      activeUser,
      deactiveUser,
      admins,
      citizens,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  getUserStatistic,
  deleteUser,
  updateUserRole,
};