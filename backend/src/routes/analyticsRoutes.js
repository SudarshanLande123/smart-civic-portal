const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getDashboardSummary,
  getCategoryStatistics,
  getStatusStatistics,
  getMonthlyTrends,
  getTopProblemAreas,
  getAdminPerformance,
} = require("../controllers/analyticsController");

router.get("/summary", protect, authorize("admin", "superadmin"), getDashboardSummary);

router.get("/categories", protect, authorize("admin", "superadmin"), getCategoryStatistics);

router.get("/status", protect, authorize("admin", "superadmin"), getStatusStatistics);

// Fixed: was "/trends".protect (dot, not comma) — route never registered
router.get("/trends", protect, authorize("admin", "superadmin"), getMonthlyTrends);

router.get("/areas", protect, authorize("admin", "superadmin"), getTopProblemAreas);

router.get("/admins", protect, authorize("admin", "superadmin"), getAdminPerformance);

module.exports = router;