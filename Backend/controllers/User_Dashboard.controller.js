const userDashService = require('../services/User_Dashboard.service');
const fs = require("fs");

// Controller function
exports.showDashboard = async (req, res) => {
  try {
    const userId = req.user._id; // req.user middleware se aata hai
    const dashboardData = await userDashService.showDashboard(userId);
    res.status(200).json(dashboardData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Earning history function
exports.showEarningHistory = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const historyData = await userDashService.showEarningHistory(userId);
    res.status(200).json(historyData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deposit function
exports.deposit = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { exchangeType, ourExchange, amount, userExchange, type } = req.body;
    let image = null;
    if (req.file) {
      image = req.file.buffer.toString("base64");
    }


    const depositData = await userDashService.deposit({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type: type
    });

    res.status(200).json({
      success: true,
      message: "Your Deposit will be received within 24 hours.",
      data: depositData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Deposit failed",
    });
  }
};

//show Deposite funcation
exports.showDeposit = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const depositData = await userDashService.showDeposit(userId);

    res.status(200).json({
      success: true,
      message: "successfully fetched data",
      data: depositData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "failed to fetched data",
    });
  }
};

// withdraw function
exports.withdraw = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { exchangeType, ourExchange, amount, userExchange, type } = req.body || {};

    if (!exchangeType || !ourExchange || !amount || !userExchange || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for withdrawal.",
      });
    }

    const withdrawData = await userDashService.withdraw({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      type,
    });

    res.status(200).json({
      success: true,
      message: "Your withdrawal will be received within 24 hours.",
      data: withdrawData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to withdraw",
    });
  }
};


// referral function
exports.referralUser = async (req, res) => {
  try {
    const userId = req.user._id; // Comes from auth middleware

    const referralCode = await userDashService.referralUser(userId);

    res.status(200).json({
      success: true,
      message: "Referral code fetched successfully",
      referralCode: referralCode
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Referral fetch failed"
    });
  }
};

// Invest function
exports.invest = async (req, res) => {
  try {
    const userId = req.user._id; // Comes from auth middleware
    console.log(userId);

    const { from, to, amount } = req.body;

    const investmentData = await userDashService.invest(userId, from, to, amount);

    res.status(200).json({
      success: true,
      message: investmentData.message || "Investment transaction successful",
      // investmentData: investmentData
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Investment fetch failed"
    });
  }
};

// profile function
exports.profile = async (req, res) => {
  try {
    const userId = req.user._id; // req.user middleware se aata hai
    const profileData = await userDashService.profile(userId);
    res.status(200).json(profileData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// update profile function
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // req.user middleware se aata hai
    const { name, password } = req.body;
    let profileImage = null;
    if (req.file) {
      profileImage = fs.readFileSync(req.file.path, { encoding: "base64" });
    }
    const profileData = await userDashService.updateProfile(userId, name, password, profileImage);
    res.status(200).json(profileData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



