const userDashService = require("../services/User_Dashboard.service");
const UserModel = require("../models/user.model");
const {
  sendAdminDepositEmail,
  sendUserPendingDepositmail,
} = require("../services/sendMailer"); // Import the mailer function

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
    const { page = 1, limit = 8 } = req.query;
    const historyData = await userDashService.showEarningHistory(
      userId,
      page,
      limit
    );
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

    // ✅ Save deposit first (fast part)
    const depositData = await userDashService.deposit({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type,
    });

    // ✅ Send fast response immediately
    res.status(200).json({
      success: true,
      message:
        "Your deposit request has been received and will be processed within 24 hours.",
      data: depositData,
    });

    // ✅ Run emails in the background (non-blocking)
    setImmediate(async () => {
      try {
        const user = await UserModel.findById(userId);
        if (!user) return;

        await Promise.all([
          sendAdminDepositEmail({
            user,
            exchangeType,
            ourExchange,
            amount,
            userExchange,
            image,
            type,
          }),
          sendUserPendingDepositmail({
            user,
            exchangeType,
            ourExchange,
            amount,
            userExchange,
            image,
            type,
          }),
        ]);
      } catch (err) {
        console.error("Background email sending failed:", err.message);
      }
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

// controllers/userController.js
exports.withdrawOtp = async (req, res) => {
  try {
    const userId = req.user._id;

    await userDashService.withdrawOtp(userId);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "failed to send withdraw otp",
    });
  }
};

// withdraw function
exports.withdraw = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { exchangeType, ourExchange, amount, userExchange, type, otp } =
      req.body || {};

    // Basic validation
    if (
      !exchangeType ||
      !ourExchange ||
      !amount ||
      !userExchange ||
      !type ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields for withdrawal.",
      });
    }

    // Call withdraw service (this returns quickly)
    const withdrawData = await userDashService.withdraw({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      type,
      otp,
    });

    // ✅ Send immediate response to user
    res.status(200).json({
      success: true,
      message:
        "Your withdrawal request has been submitted. It will be processed within 24 hours.",
      data: withdrawData,
    });
  } catch (err) {
    console.error("Withdraw error:", err);
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
    const { page = 1, limit = 8 } = req.query;

    const referralCode = await userDashService.referralUser(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: "Referral code fetched successfully",
      referralCode: referralCode,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Referral fetch failed",
    });
  }
};

// Invest function
exports.invest = async (req, res) => {
  try {
    const userId = req.user._id; // Comes from auth middleware
    console.log(userId);

    const { from, to, amount } = req.body;

    const investmentData = await userDashService.invest(
      userId,
      from,
      to,
      amount
    );

    res.status(200).json({
      success: true,
      message: investmentData.message || "Investment transaction successful",
      // investmentData: investmentData
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Investment fetch failed",
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
    const profileData = await userDashService.updateProfile(
      userId,
      name,
      password,
      profileImage
    );
    res.status(200).json(profileData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Redeposit function
exports.redeposit = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { exchangeType, ourExchange, amount, userExchange, type, reDepId } =
      req.body;
    let image = null;
    if (req.file) {
      image = req.file.buffer.toString("base64");
    }

    const depositData = await userDashService.redeposit({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type: type,
      reDepId: reDepId,
    });

    res.status(200).json({
      success: true,
      message: "Your Deposit will be received within 24 hours.",
      data: depositData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Redeposit failed",
    });
  }
};

// Insights function
// Insights Cards function (Static Data)
exports.getInsightsCards = async (req, res) => {
  try {
    const userId = req.user._id;
    const cardsData = await userDashService.getInsightsCards(userId);

    res.status(200).json({
      success: true,
      data: cardsData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch insights cards",
    });
  }
};

// Insights Graphs function (Dynamic Data)
exports.getInsightsGraphs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { range } = req.query; // Weekly, Monthly, etc.
    console.log(range);

    const graphsData = await userDashService.getInsightsGraphs(userId, range);

    res.status(200).json({
      success: true,
      data: graphsData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to fetch insights graphs",
    });
  }
};
