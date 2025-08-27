const User = require('../models/user.model');
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model');

// Helper to get start and end of yesterday in UTC
const getUTCYesterdayRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1, // Yesterday
    0, 0, 0
  ));
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(), // Today start
    0, 0, 0
  ));
  return { start, end };
};

exports.calculateDailyEarnings = async () => {
  const { start, end } = getUTCYesterdayRange();
  console.log("Calculating daily earnings for UTC range:", start, "to", end);

  const allUsers = await User.find({});

  for (const user of allUsers) {
    const baseAmount = user.investedAmount || 0;

    // 🚨 ensure at least 100 USDT
    if (baseAmount < 100) {
      console.log(`Skipping ${user.name} - investedAmount less than 100`);
      continue;
    }

    // Yesterday's record (UTC range)
    let yesterdayRecord = await DailyEarn.findOne({
      userId: user._id,
      createdAt: { $gte: start, $lt: end }
    });

    if (!yesterdayRecord) {
      console.log(`No yesterday record for ${user.name}, using investedAmount...`);
      yesterdayRecord = {
        baseAmount: baseAmount,
        dailyProfit: (baseAmount * 1) / 100
      };
    }

    const dailyProfit = (yesterdayRecord.baseAmount * 1) / 100;
    let totalRefEarnings = 0;

    // Referral earnings
    for (const refUser of user.referredUsers || []) {
      if (!refUser.userId || refUser.refLevel === 0) continue;

      const refYesterdayRecord = await DailyEarn.findOne({
        userId: refUser.userId,
        createdAt: { $gte: start, $lt: end }
      });

      let refDailyProfit = 0;
      if (refYesterdayRecord) {
        refDailyProfit = refYesterdayRecord.dailyProfit;
      } else {
        const refUserDetails = await User.findById(refUser.userId);
        if (refUserDetails && refUserDetails.investedAmount >= 100) {
          refDailyProfit = (refUserDetails.investedAmount * 1) / 100;
        }
      }

      if (!refDailyProfit) continue;

      let percentage = 0;
      if (refUser.refLevel === 1) percentage = 3;
      else if (refUser.refLevel === 2) percentage = 2;
      else if (refUser.refLevel === 3) percentage = 1;

      const refEarnAmount = (refDailyProfit * percentage) / 100;
      totalRefEarnings += refEarnAmount;

      const refUserDetails = await User.findById(refUser.userId);
      if (refUserDetails) {
        await RedUserEarning.create({
          userId: user._id, 
          name: refUserDetails.name,
          amount: refUserDetails.investedAmount || 0,
          refLevel: refUser.refLevel,
          earningRef: refEarnAmount
        });
        console.log(`Saved referral earning for ${refUserDetails.name} (Level ${refUser.refLevel})`);
      }
    }

    // Save record in DailyEarn
    const nowUTC = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    ));

    await DailyEarn.create({
      userId: user._id,
      baseAmount,
      dailyProfit,
      refEarn: totalRefEarnings,
      createdAt: nowUTC
    });

    // ✅ Update User table totals
    user.totalBalance += (dailyProfit + totalRefEarnings);
    user.refEarn += totalRefEarnings;
    user.totalEarn += dailyProfit; // Optional: agar sirf apni earning track krni hai
    await user.save();

    console.log(`Daily earnings updated for ${user.name}: Profit=${dailyProfit}, Ref=${totalRefEarnings}`);
  }

  return { message: 'Daily earnings created & users updated successfully (UTC based)' };
};
