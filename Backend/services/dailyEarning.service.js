const User = require('../models/user.model');
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model');
const RizydraInfo = require('../models/rizydraInfo.model');
const { sendDailyProfitEmail } = require("./sendMailer");

// ================= Utilities =================

// Round to 3 decimals
const roundTo3 = (num) => parseFloat(num.toFixed(3));

// Get previous UTC day string (YYYY-MM-DD)
const getUTCPreviousDayString = () => {
  const now = new Date();
  const prev = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1
  ));
  return prev.toISOString().split("T")[0];
};

// Yesterday UTC range (for referral lookup)
const getUTCYesterdayRange = () => {
  const now = new Date();
  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1,
    0, 0, 0
  ));
  const end = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0
  ));
  return { start, end };
};

// ================= MAIN FUNCTION =================

exports.calculateDailyEarnings = async () => {

  // 🔥 Fetch dynamic daily percentage (default 1%)
  const rizydraInfo = await RizydraInfo.findOne().lean();
  const DAILY_PERCENTAGE = rizydraInfo?.dailyPercentage || 1;

  const { start, end } = getUTCYesterdayRange();
  const prevDay = getUTCPreviousDayString();

  console.log("Calculating daily earnings for UTC day:", prevDay);

  const allUsers = await User.find({});

  for (const user of allUsers) {

    // ========== Prevent duplicate daily earning ==========
    const existingRecord = await DailyEarn.findOne({
      userId: user._id,
      createdAt: {
        $gte: new Date(prevDay + "T00:00:00Z"),
        $lt: new Date(prevDay + "T23:59:59Z")
      }
    });

    if (existingRecord) {
      console.log(`⏩ Skipped ${user.name} — already calculated.`);
      continue;
    }

    // ================= ORIGINAL LOGIC =================

    const now = new Date();
    const currentInvested = roundTo3(user.investedAmount || 0);

    // ---------- Mature Pending Lots ----------
    let maturedPendingSum = 0;
    if (user.investedLots?.length > 0) {
      for (const lot of user.investedLots) {
        const hoursPassed = (now - new Date(lot.createdAt)) / (1000 * 60 * 60);
        if (lot.status === 'Pending' && hoursPassed >= 24) {
          maturedPendingSum += (lot.amount || 0);
        }
      }
    }

    const totalAfter = roundTo3(currentInvested + maturedPendingSum);
    if (totalAfter < 20) {
      console.log(`Skipping ${user.name} — amount < 20.`);
      continue;
    }

    // ---------- Update Matured Lots ----------
    let lotsUpdated = false;
    if (maturedPendingSum > 0 && user.investedLots?.length > 0) {
      for (const lot of user.investedLots) {
        const hoursPassed = (now - new Date(lot.createdAt)) / (1000 * 60 * 60);
        if (lot.status === 'Pending' && hoursPassed >= 24) {
          lot.status = 'Confirmed';
          lotsUpdated = true;
        }
      }
      user.investedAmount = roundTo3((user.investedAmount || 0) + maturedPendingSum);
    }
    if (lotsUpdated) await user.save();

    // ---------- Daily Profit (DYNAMIC %) ----------
    const compareAmount = roundTo3(user.investedAmount || 0);
    const dailyProfit = roundTo3((compareAmount * DAILY_PERCENTAGE) / 100);

    let totalRefEarnings = 0;

    // ---------- Referral Earnings (STATIC %) ----------
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
        if (refUserDetails && refUserDetails.investedAmount >= 20) {
          // 🔒 STATIC 1% (as requested)
          refDailyProfit = roundTo3((refUserDetails.investedAmount * 1) / 100);
        }
      }

      if (!refDailyProfit) continue;

      let percentage = 0;
      if (refUser.refLevel === 1) percentage = 3;
      else if (refUser.refLevel === 2) percentage = 2;
      else if (refUser.refLevel === 3) percentage = 1;

      const refEarnAmount = roundTo3((refDailyProfit * percentage) / 100);
      totalRefEarnings += refEarnAmount;

      const refUserDetails = await User.findById(refUser.userId);
      if (refUserDetails) {
        await RedUserEarning.create({
          userId: user._id,
          name: refUserDetails.name,
          amount: roundTo3(refUserDetails.investedAmount || 0),
          refLevel: refUser.refLevel,
          earningRef: refEarnAmount
        });
      }
    }

    // ---------- Save Daily Earn Record ----------
    await DailyEarn.create({
      userId: user._id,
      baseAmount: compareAmount,
      dailyProfit,
      refEarn: roundTo3(totalRefEarnings),
      createdAt: new Date(prevDay + "T12:00:00Z")
    });

    // ---------- Update User Totals ----------
    user.totalBalance = roundTo3((user.totalBalance || 0) + dailyProfit + totalRefEarnings);
    user.refEarn = roundTo3((user.refEarn || 0) + totalRefEarnings);
    user.totalEarn = roundTo3((user.totalEarn || 0) + dailyProfit);

    await user.save();

    // ---------- Send Email ----------
    try {
      await sendDailyProfitEmail({
        userEmail: user.email,
        userName: user.name,
        amount: compareAmount,
        dailyEarn: dailyProfit,
        refEarn: totalRefEarnings,
        dailyPercentage: DAILY_PERCENTAGE,
        date: prevDay
      });
    } catch (error) {
      console.error(`❌ Email failed for ${user.name}:`, error.message);
    }

    console.log(`✅ ${user.name}: Profit=${dailyProfit}, Ref=${totalRefEarnings}`);
  }

  return { message: 'Daily earnings calculated successfully (dynamic percentage)' };
};
