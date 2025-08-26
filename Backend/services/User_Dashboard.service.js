const UserModel = require('../models/user.model');
const InvestmentModel = require('../models/Investment.model');
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model'); // Model ka import
const mongoose = require('mongoose');

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

    const result = await DailyEarn.aggregate([
      {
        $match: { userId: objectId }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$userInfo.name" },
          email: { $first: "$userInfo.email" },
          image: { $first: { $ifNull: ["$userInfo.image", ""] } },
          referralCode: { $first: "$userInfo.referralCode" },
          referralLevel: { $first: "$userInfo.referralLevel" },
          totalBalance: { $first: "$userInfo.totalBalance" },
          totalEarn: { $first: "$userInfo.totalEarn" },
          refEarn: { $first: "$userInfo.refEarn" },
          depositAmount: { $first: "$userInfo.depositAmount" },
          investedAmount: { $first: "$userInfo.investedAmount" },
          earnings: {
            $push: {
              baseAmount: { $ifNull: ["$baseAmount", 0] },
              dailyProfit: { $ifNull: ["$dailyProfit", 0] },
              refEarn: { $ifNull: ["$refEarn", 0] },
              date: {
                $dateToString: {
                  format: "%d %b, %Y",   // 👈 24 Oct, 2025
                  date: "$createdAt",
                  timezone: "UTC"
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          image: 1,
          referralCode: 1,
          referralLevel: 1,
          totalBalance: 1,
          totalEarn: 1,
          refEarn: 1,
          depositAmount: 1,
          investedAmount: 1,
          earnings: 1
        }
      }
    ]);

    // console.log(result);
    return result;
  } catch (err) {
    throw new Error('Error fetching earning history: ' + err.message);
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
  try {
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //   throw new Error("User not found");
    // }

    // Create new investment record
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

    // Convert amount to number before adding
    // user.depositAmount = (user.depositAmount || 0) + Number(amount);
    // user.totalBalance = (user.totalBalance || 0) + Number(amount);
    // await user.save();

    return investment;
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


// referal user function
exports.referralUser = async function (userId) {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await RedUserEarning.aggregate([
      {
        $match: { userId: objectId }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "mainUser"
        }
      },
      { $unwind: "$mainUser" },
      {
        $lookup: {
          from: "users",
          localField: "name",
          foreignField: "name",
          as: "refUserInfo"
        }
      },
      { $unwind: { path: "$refUserInfo", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          refLevel: {
            $let: {
              vars: {
                matchedRef: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$mainUser.referredUsers",
                        as: "ru",
                        cond: { $eq: ["$$ru.userId", "$refUserInfo._id"] }
                      }
                    },
                    0
                  ]
                }
              },
              in: "$$matchedRef.refLevel"
            }
          }
        }
      },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$mainUser.name" },
          email: { $first: "$mainUser.email" },
          image: { $first: "$mainUser.image" },                // 👈 Add image
          referralCode: { $first: "$mainUser.referralCode" },  // 👈 Add referral code
          referredUsers: { $first: "$mainUser.referredUsers" }, // 👈 Keep referredUsers for summary
          refEarnings: {
            $push: {
              refName: "$name",
              amount: "$amount",
              earningRef: "$earningRef",
              refLevel: "$refLevel",
              date: {
                $dateToString: {
                  format: "%d %b %Y",
                  date: "$createdAt",
                  timezone: "UTC"
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          referralSummary: {
            level1: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] }, // 👈 Prevent null
                  as: "ru",
                  cond: { $eq: ["$$ru.refLevel", 1] }
                }
              }
            },
            level2: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] }, // 👈 Prevent null
                  as: "ru",
                  cond: { $eq: ["$$ru.refLevel", 2] }
                }
              }
            },
            level3: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$referredUsers", []] }, // 👈 Prevent null
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
          _id: 0,
          name: 1,
          email: 1,
          image: 1,
          referralCode: 1,
          refEarnings: 1,
          referralSummary: 1
        }
      }
    ]);

    if (!result.length) {
      throw new Error("No referral earnings found for this userId");
    }

    return result[0];
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
      throw new Error("Invalid credentials");
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
      status: "Pending", // default status
    });

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

