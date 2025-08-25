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

    // Yesterday's record (UTC range)
    const yesterdayRecord = await DailyEarn.findOne({
      userId: user._id,
      createdAt: { $gte: start, $lt: end }
    });

    if (!yesterdayRecord) {
      console.log(`No yesterday record for ${user.name}, skipping dailyProfit calculation...`);
      continue;
    }

    const dailyProfit = (yesterdayRecord.baseAmount * 1) / 100;
    let totalRefEarnings = 0;

    // Referral earnings
    for (const refUser of user.referredUsers || []) {
      if (!refUser.userId || refUser.refLevel === 0) continue;


      //   console.log("next");
      const refYesterdayRecord = await DailyEarn.findOne({
        userId: refUser.userId,
        createdAt: { $gte: start, $lt: end }
      });

      // console.log("Referral User ID:", refUser.userId, "Yesterday Record:", refYesterdayRecord);

      if (!refYesterdayRecord) continue;

      let percentage = 0;
      if (refUser.refLevel === 1) percentage = 3;
      else if (refUser.refLevel === 2) percentage = 2;
      else if (refUser.refLevel === 3) percentage = 1;

      const refEarnAmount = (refYesterdayRecord.dailyProfit * percentage) / 100;
      totalRefEarnings += refEarnAmount;

      // Save referral earning
      console.log("Referral User ID:", refUser.userId);

      const refUserDetails = await User.findById(refUser.userId);
      if (refUserDetails) {
        await RedUserEarning.create({
          userId: user._id, // jisne earning ki
          name: refUserDetails.name,
          amount: refUserDetails.investedAmount || 0,
          refLevel: refUser.refLevel, // <-- yaha refLevel add kiya
          earningRef: refEarnAmount
        });
        console.log(`Saved referral earning for ${refUserDetails.name} (Level ${refUser.refLevel}) in RedUserEarning`);
      }
    }

    // Save record with exact UTC "now"
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

    console.log(`Created daily earnings record for ${user.name}`);
  }

  return { message: 'Daily earnings created successfully (UTC based)' };
};
