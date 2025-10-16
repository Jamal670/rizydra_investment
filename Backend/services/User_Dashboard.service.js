const UserModel = require('../models/user.model');
const InvestmentModel = require("../models/investment.model");
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model'); // Model ka import
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendWithdrawEmail} = require('./sendMailer'); // Import the mailer function
// const transporter = require('./mailer'); // transporter ko alag file me export kiya hoga        

// Service function
exports.showDashboard = async function showDashboard(userId) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 1) Line Chart → Daily earnings trend (DailyEarn table)
    const lineChart = await DailyEarn.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalDailyEarnings: { $sum: "$dailyProfit" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 2) Pie Chart → Deposit vs Invested (Investment table with Pending + Confirmed only)
    const investments = await InvestmentModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: { $in: ["Pending", "Confirmed"] }
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const pieChart = {
      deposit: investments.find(i => i._id === "Deposit")?.totalAmount || 0,
      invested: investments.find(i => i._id === "Withdraw")?.totalAmount || 0
    };


    // // 3) Bar Chart → Referral earnings (RefUserEarning table)
    // const barChart = await RedUserEarning.aggregate([
    //   { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    //   {
    //     $group: {
    //       _id: "$userId",
    //       totalReferralEarnings: { $sum: "$earningRef" },
    //       name: { $first: "$name" }
    //     }
    //   },
    //   { $sort: { totalReferralEarnings: -1 } }
    // ]);

    // 4) Stacked Area Chart → Daily vs Ref earnings (DailyEarn table)
    const stackedAreaChart = await DailyEarn.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyEarnings: { $sum: "$dailyProfit" },
          referralEarnings: { $sum: "$refEarn" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 5) Card Data → From User table directly
    const cardData = {
      totalBalance: (user.totalBalance || 0).toFixed(2),
      totalEarn: (user.totalEarn || 0).toFixed(2),
      refEarn: (user.refEarn || 0).toFixed(2),
      depositAmount: (user.depositAmount || 0).toFixed(2),
      investedAmount: (user.investedAmount || 0).toFixed(2)
    };

    return {
      name: user.name,
      email: user.email,
      image: user.image || '',
      referralCode: user.referralCode,
      lineChart: lineChart.map(item => ({
        date: item._id,
        value: item.totalDailyEarnings
      })),
      pieChart,
      // barChart,
      stackedAreaChart: stackedAreaChart.map(item => ({
        date: item._id,
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
          from: 'investments', // collection name in MongoDB
          let: { userId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
            {
              $lookup: {
                from: 'investments',
                let: { currentId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$reDepId', '$$currentId'] } } },
                  { $limit: 1 }
                ],
                as: 'linkedRedeposits'
              }
            },
            {
              $addFields: {
                alreadyRedeposit: { $gt: [{ $size: '$linkedRedeposits' }, 0] }
              }
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
                date: { $dateToString: { format: "%d %b %Y", date: "$createdAt" } }
              }
            }
          ],
          as: 'confirmedInvestments'
        }
      },
      {
        // ✅ Calculate total pending investedLots amount
        $addFields: {
          pendingLotsSum: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$investedLots',
                    as: 'lot',
                    cond: { $eq: ['$$lot.status', 'Pending'] }
                  }
                },
                as: 'pendingLot',
                in: '$$pendingLot.amount'
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
          depositAmount: 1,
          investedAmount: 1,
          refEarn: 1,
          totalEarn: 1,
          totalBalance: 1,
          image: 1,
          referralCode: 1,
          confirmedInvestments: 1,
          pendingLotsSum: 1 // ✅ Include pending total in response
        }
      }
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

      // 🧩 Deduct and record investment
      // user.investedAmount += amt;
      user.totalBalance -= amt;

      // ✅ Push into investedLots with type = 'Pending'
      user.investedLots.push({
        amount: amt,
        status: "Pending",
        createdAt: new Date(),
      });
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
    }

    else {
      throw new Error("Invalid transfer type");
    }

    await user.save();

    return {
      success: true,
      message: "Your investment will be added after 24 hours.",
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
      user.password = await bcrypt.hash(password, 10);
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

// Redeposit function
exports.redeposit = async function ({
  userId,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  image, // Base64 image
  type,
  reDepId
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
      reDepId: reDepId
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
    }).catch(err => {
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


