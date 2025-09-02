const express = require('express');
const path = require('path');
const multer = require("multer");
const fs = require("fs");

// multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const uploadPath = path.join(__dirname, '../public/uploads');
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// Ensure uploads folder exists


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage: storage });


const UserDashController = require('../controllers/User_Dashboard.controller');
const dailyEarnController = require('../controllers/dailyEarning.controller');
const authMiddleware = require('../controllers/middleware/authMiddleware');

const router = express.Router();

router.get('/showUserDash', authMiddleware, UserDashController.showDashboard);
router.get('/earnhistory', authMiddleware, UserDashController.showEarningHistory);
// router.get('/referralUser', authMiddleware, UserDashController.showReferralUsers);
router.post('/deposit', authMiddleware, upload.single('image'), UserDashController.deposit);
router.get('/showdeposit', authMiddleware, UserDashController.showDeposit);
router.post('/investamount', authMiddleware, UserDashController.invest);
router.post('/withdraw', authMiddleware, UserDashController.withdraw);
router.get('/referal', authMiddleware, UserDashController.referralUser);
router.get('/profile', authMiddleware, UserDashController.profile);
router.post('/updateprofile', authMiddleware, upload.single('profileImage'), UserDashController.updateProfile);
router.post('/redeposit', authMiddleware, upload.single('images'), UserDashController.redeposit);
router.post('/dailyearn', dailyEarnController.runDailyEarningCalculation);

module.exports = router;
