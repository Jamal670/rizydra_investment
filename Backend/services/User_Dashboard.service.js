const UserModel = require("../models/user.model");
const InvestmentModel = require("../models/investment.model");
const DailyEarn = require("../models/dailyEarn.model");
const RedUserEarning = require("../models/refUserEarn.model"); // Model ka import
const { withdrawOtpEmail } = require("./sendMailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  sendUserPendingWithdrawMail,
  sendAdminWithdrawEmail,
  userAccountUpdate,
} = require("./sendMailer"); // Import the mailer function
// const transporter = require('./mailer'); // transporter ko alag file me export kiya hoga

// Service function
exports.showDashboard = async function showDashboard(userId) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // --------------------------
    // (1) LAST 7 DAYS FILTER
    // --------------------------
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    // --------------------------
    // (3) PIE CHART → Confirmed Withdraw ONLY
    // --------------------------
    const confirmedWithdraw = await InvestmentModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: "Confirmed",
          type: "Withdraw",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const pieChart = {
      withdrawConfirmed: confirmedWithdraw[0]?.total || 0,
    };

    // --------------------------
    // (4) STACKED AREA CHART → Last 7 Days
    // --------------------------
    const stackedAreaChart = await DailyEarn.aggregate([
      { $match: { userId: userObjectId, createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyEarnings: { $sum: "$dailyProfit" },
          referralEarnings: { $sum: "$refEarn" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --------------------------
    // (5) USER CARD DATA
    // --------------------------
    const pendingLotsTotal =
      user.investedLots
        .filter((lot) => lot.status === "Pending")
        .reduce((sum, lot) => sum + (lot.amount || 0), 0) || 0;

    const cardData = {
      totalBalance: Number(user.totalBalance || 0).toFixed(2),
      totalEarn: Number(user.totalEarn || 0).toFixed(2),
      depositAmount: Number(user.depositAmount || 0).toFixed(2),
      investedAmount: Number(user.investedAmount || 0).toFixed(2),
      refEarn: Number(user.refEarn || 0).toFixed(2),
      pendingInvestedLots: Number(pendingLotsTotal).toFixed(2),
    };

    // --------------------------
    // FINAL OUTPUT
    // --------------------------
    return {
      name: user.name,
      email: user.email,
      image: user.image || "",
      referralCode: user.referralCode,

      //chart data
      pieChart,
      stackedAreaChart: stackedAreaChart.map((item) => ({
        date: item._id,
        daily: item.dailyEarnings,
        referral: item.referralEarnings,
      })),

      cardData,
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw error;
  }
};

// Earning history function
exports.showEarningHistory = async (userId, page = 1, limit = 8) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const objectId = new mongoose.Types.ObjectId(userId);
    const skip = (page - 1) * limit;

    // Get total count of earnings for this user
    const totalEarnings = await DailyEarn.countDocuments({ userId: objectId });
    const totalPages = Math.ceil(totalEarnings / limit);

    const result = await UserModel.aggregate([
      {
        $match: { _id: objectId },
      },

      // Lookup earning history with pagination
      {
        $lookup: {
          from: "dailyearns",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
          ],
          as: "earnings",
        },
      },

      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          referralCode: 1,
          totalBalance: 1,
          totalEarn: 1,
          refEarn: 1,
          depositAmount: 1,
          investedAmount: 1,

          // Count Pending investedLots
          pendingLotsCount: {
            $size: {
              $filter: {
                input: "$investedLots",
                as: "lot",
                cond: { $eq: ["$$lot.status", "Pending"] },
              },
            },
          },

          // Latest earnings with date formatting
          earnings: {
            $map: {
              input: "$earnings",
              as: "e",
              in: {
                baseAmount: { $ifNull: ["$$e.baseAmount", 0] },
                dailyProfit: { $ifNull: ["$$e.dailyProfit", 0] },
                refEarn: { $ifNull: ["$$e.refEarn", 0] },
                date: {
                  $dateToString: {
                    format: "%d %b, %Y",
                    date: "$$e.createdAt",
                    timezone: "UTC",
                  },
                },
              },
            },
          },
        },
      },
    ]);

    const data = result.length > 0 ? result[0] : null;

    if (data) {
      data.pagination = {
        total: totalEarnings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      };
    }

    return data;
  } catch (err) {
    throw new Error("Error fetching earning history: " + err.message);
  }
};

// deposit function
exports.deposit = async function ({
  userId,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  image,
  type,
}) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const investment = new InvestmentModel({
    userId,
    exchangeType,
    ourExchange,
    amount,
    userExchange,
    image,
    type,
    status: "Pending",
  });

  await investment.save();
  return investment;
};

// for aggregation reference
exports.showDeposit = async (userId) => {
  try {
    const result = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "investments",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            {
              $lookup: {
                from: "investments",
                let: { currentId: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$reDepId", "$$currentId"] } } },
                  { $limit: 1 },
                ],
                as: "linkedRedeposits",
              },
            },
            {
              $addFields: {
                alreadyRedeposit: { $gt: [{ $size: "$linkedRedeposits" }, 0] },
              },
            },
            {
              $project: {
                _id: 1,
                exchangeType: 1,
                ourExchange: 1,
                amount: 1,
                userExchange: 1,
                image: 1,
                status: 1,
                type: 1,
                reDepId: 1,
                comment: 1,
                alreadyRedeposit: 1,
                date: {
                  $dateToString: { format: "%d %b %Y", date: "$createdAt" },
                },
              },
            },
          ],
          as: "confirmedInvestments",
        },
      },
      {
        // ✅ Calculate total pending investedLots amount
        $addFields: {
          pendingLotsSum: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$investedLots",
                    as: "lot",
                    cond: { $eq: ["$$lot.status", "Pending"] },
                  },
                },
                as: "pendingLot",
                in: "$$pendingLot.amount",
              },
            },
          },
        },
      },
      {
        // ✅ Add BalToInvDate comparison logic
        $addFields: {
          BalToInvHours: {
            $cond: [
              { $ifNull: ["$BalToInvDate.createdAt", false] },
              {
                $divide: [
                  { $subtract: [new Date(), "$BalToInvDate.createdAt"] },
                  1000 * 60 * 60, // convert ms → hours
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $addFields: {
          BalToInvRemaining: {
            $cond: [
              { $ne: ["$BalToInvHours", null] },
              {
                $cond: [
                  { $lt: ["$BalToInvHours", 72] },
                  { $subtract: [72, { $round: ["$BalToInvHours", 0] }] },
                  342,
                ],
              },
              null,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          depositAmount: 1,
          investedAmount: 1,
          refEarn: 1,
          totalEarn: 1,
          totalBalance: 1,
          image: 1,
          referralCode: 1,
          confirmedInvestments: 1,
          pendingLotsSum: 1,
          BalToInvDate: 1,
          BalToInvRemaining: 1, // ✅ Include remaining hours in response
        },
      },
    ]);

    if (!result || result.length === 0) throw new Error("User not found");

    return result[0];
  } catch (error) {
    throw new Error(error.message || "Error fetching user investments");
  }
};

// referral user function
exports.referralUser = async function (userId, page = 1, limit = 8) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const skip = (page - 1) * limit;

    // Get total count of referral earnings for this user
    const totalEarnings = await RedUserEarning.countDocuments({
      userId: objectId,
    });
    const totalPages = Math.ceil(totalEarnings / limit);

    const result = await UserModel.aggregate([
      {
        $match: { _id: objectId }, // Base user
      },

      // 🔹 Count Level 1, Level 2, Level 3 Users
      {
        $addFields: {
          level1Count: {
            $size: {
              $filter: {
                input: "$referredUsers",
                as: "ru",
                cond: { $eq: ["$$ru.refLevel", 1] },
              },
            },
          },
          level2Count: {
            $size: {
              $filter: {
                input: "$referredUsers",
                as: "ru",
                cond: { $eq: ["$$ru.refLevel", 2] },
              },
            },
          },
          level3Count: {
            $size: {
              $filter: {
                input: "$referredUsers",
                as: "ru",
                cond: { $eq: ["$$ru.refLevel", 3] },
              },
            },
          },
        },
      },

      // 🔹 Lookup referral earning records with pagination
      {
        $lookup: {
          from: "refuserearnings",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$userId", "$$userId"] } },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
              $project: {
                _id: 1,
                name: 1,
                amount: 1,
                refLevel: 1,
                earningRef: 1,
                investedAmount: 1,
                date: {
                  $dateToString: {
                    format: "%d %b, %Y",
                    date: "$createdAt",
                    timezone: "UTC",
                  },
                },
              },
            },
          ],
          as: "refEarnings",
        },
      },

      // 🔹 Lookup total earning per refLevel (1,2,3)
      {
        $lookup: {
          from: "refuserearnings",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
              },
            },
            {
              $group: {
                _id: "$refLevel",
                totalAmount: { $sum: "$earningRef" }, // first sum normally
              },
            },
            {
              $addFields: {
                totalAmount: { $round: ["$totalAmount", 3] }, // round to 3 decimals
              },
            },
          ],
          as: "refLevelTotals",
        },
      },

      // 🔹 Map totals into separate fields
      {
        $addFields: {
          level1Earning: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    match: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$refLevelTotals",
                            as: "r",
                            cond: { $eq: ["$$r._id", 1] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$match.totalAmount",
                },
              },
              0,
            ],
          },

          level2Earning: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    match: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$refLevelTotals",
                            as: "r",
                            cond: { $eq: ["$$r._id", 2] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$match.totalAmount",
                },
              },
              0,
            ],
          },

          level3Earning: {
            $ifNull: [
              {
                $let: {
                  vars: {
                    match: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$refLevelTotals",
                            as: "r",
                            cond: { $eq: ["$$r._id", 3] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$match.totalAmount",
                },
              },
              0,
            ],
          },
        },
      },

      // 🔹 Final Projection
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          referralCode: 1,
          investedAmount: 1,
          image: { $ifNull: ["$image", ""] },
          refEarn: 1,

          referralSummary: {
            level1Users: "$level1Count",
            level2Users: "$level2Count",
            level3Users: "$level3Count",
            level1Earning: "$level1Earning",
            level2Earning: "$level2Earning",
            level3Earning: "$level3Earning",
          },

          refEarnings: 1,
        },
      },
    ]);

    const data = result.length ? result[0] : null;

    if (data) {
      data.pagination = {
        total: totalEarnings,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      };
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Error fetching referral user data");
  }
};

// withdraw otp send to user for verificaiton
exports.withdrawOtp = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    await user.save();

    // 🔥 Email background me (non-blocking)
    setImmediate(async () => {
      try {
        await withdrawOtpEmail(user.email, otp);
        console.log(`📧 OTP sent to ${user.email}`);
      } catch (err) {
        console.error(`❌ OTP email failed:`, err.message);
      }
    });

    return true; // controller ko bas success chahiye
  } catch (error) {
    throw new Error(error.message || "Error sending withdraw otp");
  }
};

// withdraw function
exports.withdraw = async ({
  userId,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  type,
  otp,
}) => {
  try {
    console.log("Withdraw request:", {
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      type,
    });

    // 1️⃣ Fetch user
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    // 2️⃣ Verify OTP
    if (!otp) throw new Error("OTP is required");
    // Ensure otp is compared as string/number correctly
    if (String(user.otp) !== String(otp)) {
      throw new Error("Invalid OTP");
    }

    // Clear OTP after successful use to prevent replay
    user.otp = null;

    // 2️⃣ Validate amount
    if (amount < 20) throw new Error("Minimum withdraw amount is 20 USDT");
    if (user.totalBalance < amount) throw new Error("Insufficient balance");

    // 3️⃣ Deduct balance immediately
    user.totalBalance -= amount;
    await user.save();

    // 4️⃣ Create withdraw record
    const withdrawRecord = await InvestmentModel.create({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      type,
      status: "Pending",
    });

    // 5️⃣ Send emails asynchronously (background)
    Promise.all([
      sendAdminWithdrawEmail({
        user,
        exchangeType,
        amount,
        userExchange,
        type,
      }),
      sendUserPendingWithdrawMail({
        user,
        amount,
        type,
        exchangeType,
        userExchange,
      }),
    ])
      .then(() => console.log("Withdraw emails sent in background"))
      .catch((err) => console.error("Withdraw email error:", err));

    // ✅ Return immediately
    return {
      success: true,
      message: "Withdraw request created successfully",
      withdrawRecord,
    };
  } catch (error) {
    console.error("Withdraw service error:", error);
    throw new Error(error.message || "Error creating withdraw record");
  }
};

// invest function
exports.invest = async (userId, from, to, amount) => {
  try {
    console.log("Investing:", { userId, from, to, amount });

    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(objectId);
    if (!user) throw new Error("User not found");

    // Convert to number
    const amt = Number(amount);
    if (amt <= 0) throw new Error("Amount must be greater than 0");

    if (from === to) {
      throw new Error("From and To cannot be the same");
    }

    // ✅ CASE 1: Deposit ➜ Invest
    if (from === "Deposit" && to === "Invest") {
      if (amt <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      if (user.totalBalance < amt) {
        throw new Error("Insufficient Balance");
      }

      // 🧩 Minimum investment checks
      if (user.investedAmount < 100) {
        if (user.totalBalance >= 100 && amt < 100) {
          throw new Error("Minimum investment amount is 100");
        } else if (user.totalBalance < 100 && amt < 20) {
          throw new Error("Minimum investment amount is 20");
        }
      } else {
        if (amt < 100) {
          throw new Error("Minimum investment amount is 100");
        }
      }

      // ✅ NEW RULES:
      // If amount is between 20 and 100 → must be multiple of 20
      if (amt >= 20 && amt < 100 && amt % 20 !== 0) {
        throw new Error("Investment must be a multiple of 20");
      }

      // If balance >= 100 → amount must be multiple of 100
      if (user.totalBalance >= 100 && amt >= 100 && amt % 100 !== 0) {
        throw new Error("Investment must be a multiple of 100");
      }

      // 🧩 Deduct and record investment
      user.totalBalance -= amt;

      // ✅ Push into investedLots with type = 'Pending'
      user.investedLots.push({
        amount: amt,
        status: "Pending",
        createdAt: new Date(),
      });

      // 🕒 Update BalToInvDate field with current date
      user.BalToInvDate = { createdAt: new Date() };
    }

    // ✅ CASE 2: Invest ➜ Deposit (withdraw)
    else if (from === "Invest" && to === "Deposit") {
      if (user.investedAmount < 20) {
        throw new Error("Insufficient Invest Balance (minimum 20 required)");
      }

      if (amt < 20) {
        throw new Error("Minimum withdraw amount is 20");
      }

      if (user.investedAmount < amt) {
        throw new Error("Insufficient Invest Balance");
      }

      // 🧩 Withdraw logic
      user.investedAmount -= amt;
      user.totalBalance += amt;
    } else {
      throw new Error("Invalid transfer type");
    }

    await user.save();

    return {
      success: true,
      message: "Transaction successful.",
      user,
    };
  } catch (error) {
    if (error.message.includes("Insufficient Invest Balance")) {
      throw new Error(
        "Insufficient Invest Balance. You need at least 20 USDT in your investment wallet."
      );
    }
    throw new Error(error.message);
  }
};

exports.getInsightsData = async (userId, range = "Weekly") => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(userObjectId);
    if (!user) throw new Error("User not found");

    // 1. Date Range Logic
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Start of today

    switch (range) {
      case "Weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "Monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "Six Month":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "Yearly":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "Lastly":
        startDate = new Date(0); // Beginning of epoch
        break;
      default:
        startDate.setDate(startDate.getDate() - 7); // Default Weekly
    }

    // 2. Metrics (Card Data)
    // Pending Balance = Pending Withdrawals
    const pendingWithdrawals = await InvestmentModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "Withdraw",
          status: "Pending",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingBalance = pendingWithdrawals[0]?.total || 0;

    const confirmedWithdrawals = await InvestmentModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "Withdraw",
          status: "Confirmed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const withdrawAmount = confirmedWithdrawals[0]?.total || 0;

    // Total Referrals
    const totalReferrals = user.referredUsers ? user.referredUsers.length : 0;

    const metrics = {
      totalAmount: user.totalBalance || 0,
      totalEarnings: user.totalEarn || 0,
      referralEarnings: user.refEarn || 0,
      totalReferrals: totalReferrals,
      depositAmount: user.depositAmount || 0,
      withdrawAmount: withdrawAmount,
      investedAmount: user.investedAmount || 0,
      pendingBalance: pendingBalance,
    };

    // 3. Graphs Data

    // Graph 1: Line Graph (Daily Earnings Trend)
    const dailyEarningsData = await DailyEarn.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyProfit: { $sum: "$dailyProfit" },
          refEarn: { $sum: "$refEarn" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Graph 2: Pie Graph (Deposit vs Withdraw)
    // Already have depositAmount and withdrawAmount in metrics

    // Graph 3: Pie Graph (Balance Distribution)
    // Already have totalBalance, investedAmount, pendingBalance in metrics

    // Graph 4: Bar Graph (Referral Earnings by Level)
    const referralEarningsByLevel = await RedUserEarning.aggregate([
      {
        $match: {
          userId: userObjectId,
        },
      },
      {
        $group: {
          _id: "$refLevel",
          total: { $sum: "$earningRef" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format Referral Earnings for easy frontend consumption (Level 1, 2, 3)
    const referralLevels = { level1: 0, level2: 0, level3: 0 };
    referralEarningsByLevel.forEach((item) => {
      if (item._id === 1) referralLevels.level1 = item.total;
      if (item._id === 2) referralLevels.level2 = item.total;
      if (item._id === 3) referralLevels.level3 = item.total;
    });

    return {
      user: {
        name: user.name,
        email: user.email,
        image: user.image || "",
        referralCode: user.referralCode || "",
      },
      metrics,
      graphs: {
        dailyEarnings: dailyEarningsData,
        referralLevels,
      },
    };
  } catch (error) {
    throw new Error(error.message || "Error fetching insights data");
  }
};

// profile function
exports.profile = async function profile(userId) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      image: user.image, // Default image if not set
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
      referralLevel: user.referralLevel,
    };
  } catch (error) {
    throw new Error("Error fetching profile data");
  }
};
// update profile function
exports.updateProfile = async function updateProfile(
  userId,
  name,
  password,
  profileImage
) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Only update fields that are provided
    if (name && name !== user.name) {
      user.name = name;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (profileImage) {
      user.image = profileImage;
    }

    await user.save();

    // ---------------- Send Account Update Email in background ----------------
    const updateDate = new Date().toLocaleString();
    userAccountUpdate({
      name: user.name,
      email: user.email,
      date: updateDate,
    });

    // ---------------- Return fast response ----------------
    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        referralCode: user.referralCode,
        referralLevel: user.referralLevel,
      },
    };
  } catch (error) {
    throw new Error("Error updating profile: " + error.message);
  }
};

// Redeposit function
exports.redeposit = async function ({
  userId,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  image, // Base64 image
  type,
  reDepId,
}) {
  try {
    // ✅ User fetch
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // ✅ New investment record
    const investment = new InvestmentModel({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type,
      status: "Pending",
      reDepId: reDepId,
    });

    await investment.save();

    // ✅ Send Email in background (no await)
    sendDepositEmail({
      user,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type,
    }).catch((err) => {
      console.error("Email sending failed:", err.message);
    });

    // ✅ Return fast response
    return {
      success: true,
      message: "Deposit saved, email is being sent in background",
      investment,
    };
  } catch (error) {
    throw new Error(error.message || "Error processing deposit");
  }
};
