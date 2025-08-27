const UserModel = require('../models/user.model');
const InvestmentModel = require('../models/Investment.model');
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model'); // Model ka import
const mongoose = require('mongoose');
const { sendWithdrawEmail, sendDepositEmail } = require('./sendMailer'); // Import the mailer function
// const transporter = require('./mailer'); // transporter ko alag file me export kiya hoga        

// Service function
exports.showDashboard = async function showDashboard(userId) {
  try {
    // Get user basic info first
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 1) Line Chart → Daily earnings/profit trends (from RefUserEarning)
    const lineChart = await RedUserEarning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalEarnings: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2) Pie Chart → Deposit vs Invested Balance
    const deposits = await DailyEarn.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalDeposit: { $sum: "$baseAmount" } } }
    ]);
    const investments = await InvestmentModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalInvested: { $sum: "$amount" } } }
    ]);
    const pieChart = {
      deposit: deposits[0]?.totalDeposit || 0,
      invested: investments[0]?.totalInvested || 0
    };

    // 3) Bar Chart → Referral earnings comparison between users
    const barChart = await RedUserEarning.aggregate([
      {
        $group: {
          _id: "$userId",
          totalReferralEarnings: { $sum: "$earningRef" },
          name: { $first: "$name" }
        }
      },
      { $sort: { totalReferralEarnings: -1 } }
    ]);

    // 4) Stacked Area Chart → Combined growth (daily + referral earnings)
    const stackedAreaChart = await RedUserEarning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyEarnings: { $sum: "$amount" },
          referralEarnings: { $sum: "$earningRef" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5) Card Data → User balance information
    const depositAmount = user.depositAmount || 0;
    const investedAmount = user.investedAmount || 0;
    const totalEarn = user.totalEarn || 0;
    const refEarn = user.refEarn || 0;
    const totalBalance = user.totalBalance || 0;

    const cardData = {
      totalBalance: totalBalance.toFixed(2),
      totalEarn: totalEarn.toFixed(2),
      refEarn: refEarn.toFixed(2),
      depositAmount: depositAmount.toFixed(2),
      investedAmount: investedAmount.toFixed(2)
    };

    return {
      name: user.name,
      email: user.email,
      image: user.image || '',
      referralCode: user.referralCode, // 👈 referralCode added here
      lineChart: lineChart.map(item => item.totalEarnings),
      pieChart,
      barChart,
      stackedAreaChart: stackedAreaChart.map(item => ({
        daily: item.dailyEarnings,
        referral: item.referralEarnings
      })),
      cardData
    };
  } catch (error) {
    console.error("Chart data error:", error);
    throw error;
  }
};


// Earning history function
exports.showEarningHistory = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await UserModel.aggregate([
      {
        $match: { _id: objectId }   // 👈 starting from users collection
      },
      {
        $lookup: {
          from: "dailyearns",
          localField: "_id",
          foreignField: "userId",
          as: "earnings"
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          image: { $ifNull: ["$image", ""] },
          referralCode: 1,
          referralLevel: 1,
          totalBalance: 1,
          totalEarn: 1,
          refEarn: 1,
          depositAmount: 1,
          investedAmount: 1,
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
                    timezone: "UTC"
                  }
                }
              }
            }
          }
        }
      }
    ]);

    return result.length > 0 ? result[0] : null;
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
  image, // Base64 image
  type,
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
    });

    await investment.save();

    // ✅ Send Email (Separate Function)
    await sendDepositEmail({
      user,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      image,
      type,
    });

    return {
      success: true,
      message: "Deposit saved & email sent successfully",
      investment,
    };

  } catch (error) {
    throw new Error(error.message || "Error processing deposit");
  }
};

// Show deposit function
exports.showDeposit = async (userId) => {
  try {
    const result = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'investments', // collection name in MongoDB
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$userId', '$$userId'] }] } } },
            {
              $project: {
                exchangeType: 1, ourExchange: 1, amount: 1, userExchange: 1, image: 1, status: 1, type: 1, date: {
                  $dateToString: { format: "%d %b %Y", date: "$createdAt" }
                }
              }
            }
          ],
          as: 'confirmedInvestments'
        }
      },
      { $project: { _id: 1, name: 1, email: 1, depositAmount: 1, investedAmount: 1, refEarn: 1, totalEarn: 1, confirmedInvestments: 1, totalBalance: 1, image: 1, referralCode: 1 } }
    ]);

    if (!result || result.length === 0) throw new Error("User not found");

    return result[0];
  } catch (error) {
    throw new Error(error.message || "Error fetching user investments");
  }
};


// referral user function
exports.referralUser = async function (userId) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await UserModel.aggregate([
      {
        $match: { _id: objectId } // 👉 Base user
      },
      {
        $lookup: {
          from: "refuserearnings",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] } // 👈 Match userId with User._id
              }
            },
            {
              $lookup: {
                from: "users", // 👈 join with User collection
                localField: "userId",
                foreignField: "_id",
                as: "userInfo"
              }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 1,
                amount: 1,
                refLevel: 1,
                earningRef: 1,
                refName: "$name",
                userId: 1,
                image: { $ifNull: ["$userInfo.image", ""] }, // 👈 User image
                date: {
                  $dateToString: {
                    format: "%d%b, %Y", // 👈 25Oct, 2025
                    date: "$createdAt",
                    timezone: "UTC"
                  }
                }
              }
            }
          ],
          as: "refEarnings"
        }
      },
      {
        $addFields: {
          referralSummary: {
            level1: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] },
                  as: "ru",
                  cond: { $eq: ["$$ru.refLevel", 1] }
                }
              }
            },
            level2: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] },
                  as: "ru",
                  cond: { $eq: ["$$ru.refLevel", 2] }
                }
              }
            },
            level3: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] },
                  as: "ru",
                  cond: { $eq: ["$$ru.refLevel", 3] }
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          image: { $ifNull: ["$image", ""] }, // Base user image
          referralCode: 1,
          investedAmount: 1,
          referralSummary: 1,
          refEarnings: 1
        }
      }
    ]);

    return result.length ? result[0] : null;
  } catch (error) {
    throw new Error(error.message || "Error fetching referral user data");
  }
};




// withdraw function
exports.withdraw = async ({ userId, exchangeType, ourExchange, amount, userExchange, type }) => {
  try {
    console.log("Withdrawing:", { userId, exchangeType, ourExchange, amount, userExchange, type });

    // 1. Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Invalid user");
    }

    // 🚨 Minimum withdraw limit check
    if (amount < 20) {
      throw new Error("Minimum withdraw amount is 20");
    }

    // 2. Check if user has enough balance
    if (user.totalBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // 3. Subtract amount from balance
    user.totalBalance -= amount;
    await user.save();

    // 4. Create withdraw record
    const withdrawRecord = await InvestmentModel.create({
      userId,
      exchangeType,
      ourExchange,
      amount,
      userExchange,
      type,
      status: "Pending",
    });

    // 5. Send withdraw notification email
    try {
      await sendWithdrawEmail(userId, amount, exchangeType, userExchange, type);
    } catch (mailErr) {
      console.error("Withdraw email failed:", mailErr);
    }

    return withdrawRecord;
  } catch (error) {
    throw new Error(error.message || "Error creating withdraw record");
  }
};




// invest function
exports.invest = async (userId, from, to, amount) => {
  try {
    console.log("Investing:", { userId, from, to, amount });

    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await UserModel.findById(objectId);
    if (!user) throw new Error("User not founddd");

    // Convert to number
    const amt = Number(amount);
    if (amt <= 0) throw new Error("Amount must be greater than 0");

    if (from === to) {
      throw new Error("From and To cannot be the same");
    }

    if (from === "Deposit" && to === "Invest") {
      if (amt < 100) {
        throw new Error("Minimum transfer amount from Balance to Invest is 100");
      }
      if (user.totalBalance < amt) {
        throw new Error("Insufficient Balance");
      }
      // user.depositAmount -= amt;
      user.investedAmount += amt;
      user.totalBalance -= amt;
    }
    else if (from === "Invest" && to === "Deposit") {
      if (user.investedAmount < 100) {
        throw new Error("Insufficient Invest Balance (minimum 100 required)");
      }

      if (amt < 100) {
        throw new Error("Minimum withdraw amount is 100");
      }

      if (user.investedAmount < amt) {
        throw new Error("Insufficient Invest Balance");
      }

      // withdraw logic
      user.investedAmount -= amt;
      user.totalBalance += amt;
    }
    else {
      throw new Error("Invalid transfer type");
    }

    await user.save();

    return {
      success: true,
      message: "Investment transaction successful",
      user,
    };
  } catch (error) {
    throw new Error(error.message || "Error processing investment transaction");
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
}
// update profile function
exports.updateProfile = async function updateProfile(userId, name, password, profileImage) {
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
      user.password = password;
    }

    if (profileImage) {
      user.image = profileImage;
    }

    await user.save();

    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        referralCode: user.referralCode,
        referralLevel: user.referralLevel
      }
    };

  } catch (error) {
    throw new Error("Error updating profile: " + error.message);
  }
}

