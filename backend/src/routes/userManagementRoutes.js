const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {getAllUsers,
  getUserById,
  activateUser,
  deactivateUser,
  getUserStatistic,
  deleteUser,
  updateUserRole} = require("../controllers/userManagementController");

router.get(
  "/",
  protect,
  authorize("superadmin"),
  getAllUsers
);

router.get(
  "/stats",
  protect,
  authorize("superadmin"),
  getUserStatistic
);

router.get(
  "/:id",
  protect,
  authorize("superadmin"),
  getUserById
);

router.put(
  "/:id/deactivate",
  protect,
  authorize("superadmin"),
  deactivateUser,

);

router.put(
  "/:id/activate",
  protect,
  authorize("superadmin"),
  activateUser
);

router.put(
  "/:id/role",
  protect,
  authorize("superadmin"),
  updateUserRole
);

router.delete(
  "/:id",
  protect,
  authorize("superadmin"),
  deleteUser
);

module.exports = router;