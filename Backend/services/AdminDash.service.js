const User = require("../models/user.model");
const Investment = require("../models/investment.model");
const DailyEarn = require("../models/dailyEarn.model");
const RefUserEarning = require("../models/refUserEarn.model");
const Contact = require("../models/contactUs.model");
const { sendDepositAcceptedEmail, sendDepositDeclinedEmail, sendWithdrawAcceptedEmail, sendWithdrawDeclinedEmail } = require("./sendMailer"); // Add this import

// ======================== Dashboard Data (All Graphs + Totals + Users List) ========================
exports.GetAllUsers = async () => {
    try {
        // 1) User Growth
        const userGrowthPromise = User.aggregate([
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

        // 2) Referral Earnings (✅ refLevel wise SUM)
        const referralPerformancePromise = RefUserEarning.aggregate([
            {
                $group: {
                    _id: "$refLevel",
                    totalAmount: { $sum: "$earningRef" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // 3) Daily Earnings
        const dailyEarningsPromise = DailyEarn.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    totalProfit: { $sum: "$dailyProfit" },
                    totalRef: { $sum: "$refEarn" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]);

        // 4) Investments Overview
        const depositsVsWithdrawsPromise = Investment.aggregate([
            { $group: { _id: "$type", total: { $sum: "$amount" } } },
        ]);

        // 5) Top Users
        const topUsersPromise = User.aggregate([
            { $project: { name: 1, email: 1, totalBalance: 1, totalEarn: 1 } },
            { $sort: { totalBalance: -1 } },
            { $limit: 5 },
        ]);

        // 6) Totals (balance, invest, refEarn, earn) -> User se
        const totalsPromise = User.aggregate([
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

        // 7) Deposit Totals (Investment se)
        const depositTotalsPromise = Investment.aggregate([
            { $match: { type: "Deposit" } },
            { $group: { _id: null, totalDeposit: { $sum: "$amount" } } },
        ]);

        // 8) Withdraw Totals (Investment se)
        const withdrawTotalsPromise = Investment.aggregate([
            { $match: { type: "Withdraw" } },
            { $group: { _id: null, totalWithdraw: { $sum: "$amount" } } },
        ]);

        // 9) All Users List
        const allUsersPromise = User.find(
            {},
            "_id name email totalBalance depositAmount investedAmount refEarn totalEarn status createdAt"
        ).lean();

        // 10) Total Users Count
        const totalUsersCountPromise = User.countDocuments();

        // Run all queries in parallel
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

        // Format return
        return {
            userGrowth: userGrowth.map(u => ({
                date: `${u._id.year}-${u._id.month}-${u._id.day}`,
                count: u.count,
            })),
            referralPerformance: referralPerformance.map(r => ({
                refLevel: r._id,
                totalAmount: r.totalAmount,
            })),
            dailyEarnings: dailyEarnings.map(e => ({
                date: `${e._id.year}-${e._id.month}-${e._id.day}`,
                profit: e.totalProfit,
                ref: e.totalRef,
            })),
            investments: {
                depositsVsWithdraws,
            },
            topUsers,
            totals: {
                totalBalance: totals[0]?.totalBalance || 0,
                totalDeposit: depositTotals[0]?.totalDeposit || 0, // ✅ ab Investment se
                totalInvest: totals[0]?.totalInvest || 0,
                totalRefEarn: totals[0]?.totalRefEarn || 0,
                totalEarn: totals[0]?.totalEarn || 0,
                totalWithdraw: withdrawTotals[0]?.totalWithdraw || 0,
            },
            allUsers: allUsers.map(u => ({
                ...u,
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

//======================== GEt all deposit user========================
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
                            $project: {
                                _id: 1,
                                exchangeType: 1,
                                amount: 1,
                                userExchange: 1,
                                image: 1,
                                status: 1,
                                type: 1,
                                formattedDate: {
                                    $dateToString: {
                                        format: "%d %b, %Y",
                                        date: "$createdAt",
                                        timezone: "Asia/Karachi",
                                    },
                                },
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
                                totalAmount: { $sum: "$amount" }, // Sum per status
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

        deposit.status = "Confirmed";
        deposit.image = ""; // Clear image
        await deposit.save();

        const user = await User.findById(deposit.userId);
        if (user) {
            user.totalBalance += deposit.amount;
            user.depositAmount += deposit.amount;
            await user.save();

            // Send email in background, don't await
            sendDepositAcceptedEmail(
                user.email,
                user.name,
                deposit.exchangeType,
                deposit.amount,
                deposit.userExchange,
                deposit.type,
                deposit.status
            ).catch(err => console.error("Error sending deposit accepted email:", err));
        }

        return { message: "Deposit confirmed successfully" };
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

//======================== GEt all withdraw user========================
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
                            $project: {
                                _id: 1,
                                exchangeType: 1,
                                amount: 1,
                                userExchange: 1,
                                image: 1,
                                status: 1,
                                type: 1,
                                formattedDate: {
                                    $dateToString: {
                                        format: "%d %b, %Y",
                                        date: "$createdAt",
                                        timezone: "Asia/Karachi",
                                    },
                                },
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
                                totalAmount: { $sum: "$amount" }, // Sum per status
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
            sendWithdrawAcceptedEmail(
                user.email,
                user.name,
                withdraw.exchangeType,
                withdraw.amount,
                withdraw.userExchange,
                withdraw.type,
                withdraw.status
            ).catch(err => console.error("Error sending withdraw accepted email:", err));
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
            sendWithdrawDeclinedEmail(
                user.email,
                user.name,
                withdraw.exchangeType,
                withdraw.amount,
                withdraw.userExchange,
                withdraw.type,
                withdraw.status,
                comment
            ).catch(err => console.error("Error sending withdraw declined email:", err));
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





