const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const UserDashController = require("../controllers/User_Dashboard.controller");
const dailyEarnController = require("../controllers/dailyEarning.controller");
const authMiddleware = require("../controllers/middleware/authMiddleware");

const router = express.Router();

// multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/showUserDash", authMiddleware, UserDashController.showDashboard);
router.get(
  "/insights/cards",
  authMiddleware,
  UserDashController.getInsightsCards
);
router.get(
  "/insights/graphs",
  authMiddleware,
  UserDashController.getInsightsGraphs
);
router.get(
  "/earnhistory",
  authMiddleware,
  UserDashController.showEarningHistory
);
router.get("/referal", authMiddleware, UserDashController.referralUser);
router.post(
  "/deposit",
  authMiddleware,
  upload.single("image"),
  UserDashController.deposit
);
router.get("/showdeposit", authMiddleware, UserDashController.showDeposit);
router.post("/investamount", authMiddleware, UserDashController.invest);
router.post("/withdrawOtp", authMiddleware, UserDashController.withdrawOtp);
router.post("/withdraw", authMiddleware, UserDashController.withdraw);
router.get("/profile", authMiddleware, UserDashController.profile);
router.post(
  "/updateprofile",
  authMiddleware,
  upload.single("profileImage"),
  UserDashController.updateProfile
);
router.post(
  "/redeposit",
  authMiddleware,
  upload.single("images"),
  UserDashController.redeposit
);
router.post("/dailyearn", dailyEarnController.runDailyEarningCalculation);

router.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
