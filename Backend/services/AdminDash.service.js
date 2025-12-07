const User = require("../models/user.model");
const Investment = require("../models/investment.model");
const DailyEarn = require("../models/dailyEarn.model");
const RefUserEarning = require("../models/refUserEarn.model");
const Contact = require("../models/contactUs.model");
const { sendDepositAcceptedEmail, sendDepositDeclinedEmail, sendWithdrawAcceptedEmail, sendWithdrawDeclinedEmail } = require("./sendMailer"); // Add this import

// ======================== Dashboard Data (All Graphs + Totals + Users List) ========================
exports.GetAllUsers = async () => {
  try {
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);

    // 1) User Growth (Last 7 days)
    const userGrowthPromise = User.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // 2) Referral Performance: Count per Level (User table)
    const referralPerformancePromise = User.aggregate([
      { $match: { investedAmount: { $gt: 0 } } }, // active users only
      {
        $group: {
          _id: "$referralLevel",
          count: { $sum: 1 } // count of users per level
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3) Daily Earnings (Last 7 days)
    const dailyEarningsPromise = DailyEarn.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          dailyProfit: { $sum: "$dailyProfit" },
          refEarn: { $sum: "$refEarn" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // 4) Deposits vs Withdraws (Last 7 days)
    const depositsVsWithdrawsPromise = Investment.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    // 5) Top 5 Users (Only invested ones)
    const topUsersPromise = User.aggregate([
      { $match: { investedAmount: { $gt: 0 } } },
      { $project: { name: 1, totalBalance: 1, } },
      { $sort: { totalBalance: -1 } },
      { $limit: 5 },
    ]);

    // 6) System Totals (Only invested users)
    const totalsPromise = User.aggregate([
      { $match: { investedAmount: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$totalBalance" },
          totalInvest: { $sum: "$investedAmount" },
          totalRefEarn: { $sum: "$refEarn" },
          totalEarn: { $sum: "$totalEarn" },
        },
      },
    ]);

    // 7) Total Deposit (Last 7 days)
    const depositTotalsPromise = Investment.aggregate([
      { $match: { type: "Deposit",  } },
      { $group: { _id: null, totalDeposit: { $sum: "$amount" } } },
    ]);

    // 8) Total Withdraw (Last 7 days)
    const withdrawTotalsPromise = Investment.aggregate([
      { $match: { type: "Withdraw",  } },
      { $group: { _id: null, totalWithdraw: { $sum: "$amount" } } },
    ]);

    // 9) All Active Users
    const allUsersPromise = User.find(
      { investedAmount: { $gt: 0 } },
      "_id name email totalBalance depositAmount investedAmount refEarn totalEarn status createdAt investedLots"
    )
      .sort({ createdAt: -1 })  // latest users first
      .limit(5)
      .lean();

    // 10) Total Active Users Count
    const totalUsersCountPromise = User.countDocuments({
      investedAmount: { $gt: 0 },
    });

    // Await all promises
    const [
      userGrowth,
      referralPerformance,
      dailyEarnings,
      depositsVsWithdraws,
      topUsers,
      totals,
      depositTotals,
      withdrawTotals,
      allUsers,
      totalUsersCount,
    ] = await Promise.all([
      userGrowthPromise,
      referralPerformancePromise,
      dailyEarningsPromise,
      depositsVsWithdrawsPromise,
      topUsersPromise,
      totalsPromise,
      depositTotalsPromise,
      withdrawTotalsPromise,
      allUsersPromise,
      totalUsersCountPromise,
    ]);

    // Pending Lots Calculation
    let pendingLotsTotal = 0;
    allUsers.forEach((u) => {
      if (u.investedLots?.length > 0) {
        u.investedLots.forEach((lot) => {
          if (lot.status === "Pending") pendingLotsTotal += lot.amount;
        });
      }
    });

    // Final return formatting
    return {
      userGrowth: userGrowth.map((u) => ({
        date: `${u._id.year}-${u._id.month}-${u._id.day}`,
        count: u.count,
      })),
      referralPerformance: referralPerformance.map((r) => ({
        refLevel: r._id,
        count: r.count,
      })),
      dailyEarnings: dailyEarnings.map((e) => ({
        date: `${e._id.year}-${e._id.month}-${e._id.day}`,
        dailyProfit: e.dailyProfit,
        refEarn: e.refEarn,
      })),
      investments: { depositsVsWithdraws },
      topUsers,
      totals: {
        totalBalance: totals[0]?.totalBalance || 0,
        totalDeposit: depositTotals[0]?.totalDeposit || 0,
        totalInvest: totals[0]?.totalInvest || 0,
        totalRefEarn: totals[0]?.totalRefEarn || 0,
        totalEarn: totals[0]?.totalEarn || 0,
        totalWithdraw: withdrawTotals[0]?.totalWithdraw || 0,
        pendingLotsTotal,
      },
      allUsers: allUsers.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        totalBalance: u.totalBalance,
        totalEarn: u.totalEarn,
        refEarn: u.refEarn,
        depositAmount: u.depositAmount,
        investedAmount: u.investedAmount,
        status: u.status,
        createdAt: new Date(u.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      })),
      totalUsers: totalUsersCount,
    };
  } catch (err) {
    throw new Error("Error fetching dashboard data: " + err.message);
  }
};

//======================Get all User by search=======================
exports.AdminGetUserBySearch = async (search) => {
  try {
    const user = await User.findOne({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    });

    if (!user) return null;

    // Format the date
    const formattedDate = new Date(user.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    // RETURN ONLY REQUIRED FIELDS
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      totalBalance: user.totalBalance,
      totalEarn: user.totalEarn,
      refEarn: user.refEarn,
      depositAmount: user.depositAmount,
      investedAmount: user.investedAmount,
      status: user.status,
      createdAt: formattedDate,
    };
  } catch (err) {
    throw new Error("Error fetching user by search: " + err.message);
  }
};

//======================Get all User by paginated=======================
exports.AdminGetUsersPaginated = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    // ⭐ Fetch only invested users (or all users if you prefer)
    const users = await User.find(
      {investedAmount: { $gt: 0 }},
      "_id name email totalBalance depositAmount investedAmount refEarn totalEarn status referralLevel createdAt"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({}); // total users count

    // Format date + return updated format
    const formatted = users.map((u) => {
      const formattedDate = new Date(u.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        totalBalance: u.totalBalance,
        totalEarn: u.totalEarn,
        refEarn: u.refEarn,
        depositAmount: u.depositAmount,
        investedAmount: u.investedAmount,
        status: u.status,
        referralLevel: u.referralLevel,
        createdAt: formattedDate,
      };
    });

    return {
      users: formatted,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  } catch (err) {
    throw new Error("Error fetching paginated users: " + err.message);
  }
};

//======================Get all User by paginated backward=======================
exports.AdminGetUsersPaginatedBackward = async (page, limit) => {
  try {
    const totalUsers = await User.countDocuments({ investedAmount: { $gt: 0 } });
    const totalPages = Math.ceil(totalUsers / limit);

    // Ensure page is valid
    const currentPage = page > totalPages ? totalPages : page;

    // Calculate skip from the end for backward pagination
    const skip = totalUsers - currentPage * limit;
    const adjustedSkip = skip < 0 ? 0 : skip;
    const adjustedLimit = skip < 0 ? limit + skip : limit; // adjust limit if fewer users remain

    const users = await User.find(
      {investedAmount: { $gt: 0 }},
      "_id name email totalBalance depositAmount investedAmount refEarn totalEarn status referralLevel createdAt"
    )
      .sort({ createdAt: 1 }) // ascending order for backward fetch
      .skip(adjustedSkip)
      .limit(adjustedLimit)
      .lean();

    // Format date
    const formatted = users.map((u) => {
      const formattedDate = new Date(u.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        totalBalance: u.totalBalance,
        totalEarn: u.totalEarn,
        refEarn: u.refEarn,
        depositAmount: u.depositAmount,
        investedAmount: u.investedAmount,
        status: u.status,
        referralLevel: u.referralLevel,
        createdAt: formattedDate,
      };
    });

    return {
      users: formatted,
      totalUsers,
      totalPages,
      currentPage,
    };
  } catch (err) {
    throw new Error("Error fetching backward paginated users: " + err.message);
  }
};

// ======================== GEt all users ========================
exports.AdminGetAllUsersdata = async () => {
  try {
    // ---- All Users List with required fields ----
    const users = await User.find(
      {},
      "_id name email totalBalance depositAmount investedAmount refEarn totalEarn status referralLevel createdAt"
    ).lean();

    // Format Date (e.g. "25 Oct, 2025")
    const formattedUsers = users.map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    // ---- Aggregated Totals ----

    // 1) From User Table
    const userTotals = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$totalBalance" },
          totalInvest: { $sum: "$investedAmount" },
        },
      },
    ]);

    // 2) From Investment Table (Deposit & Withdraw)
    const investmentTotals = await Investment.aggregate([
      {
        $group: {
          _id: "$type", // Deposit / Withdraw
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalDeposit =
      investmentTotals.find((i) => i._id === "Deposit")?.totalAmount || 0;
    const totalWithdraw =
      investmentTotals.find((i) => i._id === "Withdraw")?.totalAmount || 0;

    // 3) From RefUserEarning Table
    const refTotals = await RefUserEarning.aggregate([
      { $group: { _id: null, totalRefEarn: { $sum: "$earningRef" } } },
    ]);

    // 4) Referral Level Breakdown
    const referralBreakdown = await User.aggregate([
      {
        $group: {
          _id: "$referralLevel",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } } // optional: sort by referral level
    ]);

    // Convert breakdown to an object like {1: 10, 2: 5, 3: 2}
    const referralLevelCounts = {};
    referralBreakdown.forEach((item) => {
      referralLevelCounts[item._id] = item.count;
    });

    // ---- Final Return ----
    return {
      users: formattedUsers,
      totals: {
        totalBalance: userTotals[0]?.totalBalance || 0,
        totalInvest: userTotals[0]?.totalInvest || 0,
        totalDeposit,
        totalWithdraw,
        totalRefEarn: refTotals[0]?.totalRefEarn || 0,
        referralLevelCounts, // added referral breakdown
      },
    };
  } catch (err) {
    console.error("Error in AdminGetAllUsersdata:", err);
    throw new Error("Error fetching admin users data: " + err.message);
  }
};

//======================== Get all deposit users ========================
exports.AdminGetAllDepositUsers = async () => {
  try {
    const depositUsers = await Investment.aggregate([
      { $match: { type: "Deposit" } }, // Only Deposit type
      {
        $facet: {
          // Part 1: Individual Deposit Records
          deposits: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
            {
              $addFields: {
                createdAtFormatted: {
                  $dateToString: {
                    format: "%H:%M %d %b, %Y",
                    date: "$createdAt",
                  },
                },
                updatedAtFormatted: {
                  $cond: [
                    { $eq: ["$status", "Pending"] },
                    null, // Pending -> don't show updatedAt
                    {
                      $dateToString: {
                        format: "%H:%M %d %b, %Y",
                        date: "$updatedAt",
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                exchangeType: 1,
                amount: 1,
                userExchange: 1,
                image: 1,
                status: 1,
                type: 1,
                createdAtFormatted: 1,
                updatedAtFormatted: 1,
                "userData._id": 1,
                "userData.name": 1,
                "userData.email": 1,
                "userData.totalBalance": 1,
                "userData.investedAmount": 1,
              },
            },
          ],

          // Part 2: Status Breakdown with count & totalAmount
          statusBreakdown: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);

    return depositUsers[0];
  } catch (err) {
    console.error("Error in AdminGetAllDepositUsers:", err);
    throw new Error("Error fetching admin deposit users: " + err.message);
  }
};


//======================Handle Deposit Confirmed===================================
exports.AdminHandleDepositConfirmed = async (_id) => {
  try {
    const deposit = await Investment.findById(_id);
    if (!deposit) throw new Error("Deposit not found");

    // Update deposit status
    deposit.status = "Confirmed";
    deposit.image = ""; // Clear image for storage optimization
    await deposit.save();

    // Update user balance
    const user = await User.findById(deposit.userId);
    if (user) {
      user.totalBalance += deposit.amount;
      user.depositAmount += deposit.amount;
      await user.save();

      // ✅ Run email completely in the background
      process.nextTick(() => {
        sendDepositAcceptedEmail(
          user.email,
          user.name,
          deposit.exchangeType,
          deposit.amount,
          deposit.userExchange,
          deposit.type,
          deposit.status
        ).catch((err) =>
          console.error("Error sending deposit accepted email:", err.message)
        );
      });
    }

    // Return minimal fast response data
    return {
      userId: user?._id,
      amount: deposit.amount,
      status: deposit.status,
    };

  } catch (err) {
    console.error("Error in AdminHandleDepositConfirmed:", err);
    throw new Error("Error confirming deposit: " + err.message);
  }
};


//======================Handle Deposit Declined===================================
exports.AdminHandleDepositDeclined = async (_id, comment) => {
  try {
    const deposit = await Investment.findById(_id);
    if (!deposit) throw new Error("Deposit not found");

    deposit.status = "Declined";
    deposit.comment = comment;
    await deposit.save();

    const user = await User.findById(deposit.userId);
    if (user) {
      // Send email in background, don't await
      sendDepositDeclinedEmail(
        user.email,
        user.name,
        deposit.exchangeType,
        deposit.amount,
        deposit.userExchange,
        deposit.type,
        deposit.status,
        comment
      ).catch(err => console.error("Error sending deposit declined email:", err));
    }

    return { message: "Deposit declined successfully" };
  } catch (err) {
    console.error("Error in AdminHandleDepositDeclined:", err);
    throw new Error("Error declining deposit: " + err.message);
  }
};

//======================== Get all withdraw users ========================
exports.AdminGetAllWithdrawUsers = async () => {
  try {
    const withdrawUsers = await Investment.aggregate([
      { $match: { type: "Withdraw" } }, // Only Withdraw type
      {
        $facet: {
          // Part 1: Individual Withdraw Records
          withdrawals: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userData",
              },
            },
            { $unwind: "$userData" },
            {
              $addFields: {
                createdAtFormatted: {
                  $dateToString: {
                    format: "%H:%M %d %b, %Y",
                    date: "$createdAt",
                  },
                },
                updatedAtFormatted: {
                  $cond: [
                    { $eq: ["$status", "Pending"] },
                    null, // Agar Pending hai -> updatedAt show na karo
                    {
                      $dateToString: {
                        format: "%H:%M %d %b, %Y",
                        date: "$updatedAt",
                      },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                exchangeType: 1,
                amount: 1,
                userExchange: 1,
                image: 1,
                status: 1,
                type: 1,
                createdAtFormatted: 1,
                updatedAtFormatted: 1,
                "userData._id": 1,
                "userData.name": 1,
                "userData.email": 1,
                "userData.totalBalance": 1,
                "userData.investedAmount": 1,
              },
            },
          ],

          // Part 2: Status Breakdown with count & totalAmount
          statusBreakdown: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);

    return withdrawUsers[0];
  } catch (err) {
    console.error("Error in AdminGetAllWithdrawUsers:", err);
    throw new Error("Error fetching admin withdraw users: " + err.message);
  }
};


//======================Handle Withdraw Confirmed===================================
exports.AdminHandleWithdrawConfirmed = async (_id) => {
  try {
    const withdraw = await Investment.findById(_id);
    if (!withdraw) throw new Error("Withdraw not found");

    withdraw.status = "Confirmed";
    await withdraw.save();

    const user = await User.findById(withdraw.userId);
    if (user) {

      // Send email in background, don't await
      sendWithdrawAcceptedEmail({
        userEmail: user.email,
        userName: user.name,
        exchangeType: withdraw.exchangeType,
        amount: withdraw.amount,
        userExchange: withdraw.userExchange,
        type: withdraw.type,
        status: withdraw.status
      }).catch(err => console.error("Error sending withdraw accepted email:", err));

    }

    return { message: "Withdraw confirmed successfully" };
  } catch (err) {
    console.error("Error in AdminHandleWithdrawConfirmed:", err);
    throw new Error("Error confirming withdraw: " + err.message);
  }
};

//======================Handle Withdraw Declined===================================
exports.AdminHandleWithdrawDeclined = async (_id, comment) => {
  try {
    const withdraw = await Investment.findById(_id);
    if (!withdraw) throw new Error("Withdraw not found");

    withdraw.status = "Declined";
    withdraw.comment = comment;
    await withdraw.save();

    const user = await User.findById(withdraw.userId);
    if (user) {
      user.totalBalance += withdraw.amount;
      await user.save();

      // Send email in background, don't await
      sendWithdrawDeclinedEmail({
        userEmail: user.email,
        userName: user.name,
        exchangeType: withdraw.exchangeType,
        amount: withdraw.amount,
        userExchange: withdraw.userExchange,
        type: withdraw.type,
        status: withdraw.status,
        comment: comment
      }).catch(err => console.error("Error sending withdraw declined email:", err));

    }

    return { message: "Withdraw declined successfully" };
  } catch (err) {
    console.error("Error in AdminHandleWithdrawDeclined:", err);
    throw new Error("Error declining withdraw: " + err.message);
  }
};

//==============================Admin GET Specific User data================================
exports.adminGetSpecificUsers = async (_id) => {
  try {
    // --- User Info ---
    let user = await User.findById(
      _id,
      "name email image referralCode referredBy referralLevel totalBalance totalEarn refEarn depositAmount investedAmount"
    ).lean();

    if (!user) throw new Error("User not found");

    // --- Replace referredBy ID with name ---
    if (user.referredBy) {
      const refUser = await User.findById(user.referredBy, "name").lean();
      user.referredBy = refUser ? refUser.name : null;
    }

    // --- Investments ---
    const investments = await Investment.find(
      { userId: _id },
      "exchangeType amount userExchange image status type comment createdAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    const formattedInvestments = investments.map((i) => ({
      ...i,
      createdAt: new Date(i.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    // --- Daily Earnings ---
    const dailyEarns = await DailyEarn.find(
      { userId: _id },
      "baseAmount dailyProfit refEarn createdAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    const formattedDailyEarns = dailyEarns.map((d) => ({
      ...d,
      createdAt: new Date(d.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    // --- Referral Earnings ---
    const referralEarnings = await RefUserEarning.find(
      { userId: _id },
      "name amount refLevel earningRef createdAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    const formattedReferralEarnings = referralEarnings.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    // --- Referral Level Counts (hierarchy) ---
    const level1Users = await User.find({ referredBy: _id }, "_id").lean();
    const level1Ids = level1Users.map((u) => u._id);

    const level2Users = await User.find(
      { referredBy: { $in: level1Ids } },
      "_id"
    ).lean();
    const level2Ids = level2Users.map((u) => u._id);

    const level3Users = await User.find(
      { referredBy: { $in: level2Ids } },
      "_id"
    ).lean();

    const referralLevelCounts = {
      level1: level1Ids.length,
      level2: level2Ids.length,
      level3: level3Users.length,
    };

    // --- Final Response ---
    return {
      user: {
        ...user,
        referralLevelCounts,
      },
      investments: formattedInvestments,
      dailyEarns: formattedDailyEarns,
      referralEarnings: formattedReferralEarnings,
    };
  } catch (err) {
    console.error("Error in adminGetSpecificUsers:", err);
    throw new Error("Error fetching user details: " + err.message);
  }
};

//======================Admin GET Contact Us Data================================
exports.admincontactUs = async () => {
  try {
    const contactUs = await Contact.find().lean();
    return contactUs;
  } catch (err) {
    console.error("Error in admincontactUs:", err);
    throw new Error("Error fetching contact us data: " + err.message);
  }
};

//======================Admin DELETE User Data================================
exports.adminDeleteUser = async (_id) => {
  try {
    // Step 1: Delete user
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      return { message: "User not found" };
    }

    // Step 2: Delete related records
    await Investment.deleteMany({ userId: _id });
    await DailyEarn.deleteMany({ userId: _id });
    await RefUserEarning.deleteMany({ userId: _id });

    return { message: "User and related data deleted successfully" };
  } catch (err) {
    console.error("Error in adminDeleteUser:", err);
    throw new Error("Error deleting user: " + err.message);
  }
};





