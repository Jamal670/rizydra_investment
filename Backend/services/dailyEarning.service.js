const User = require('../models/user.model');
const DailyEarn = require('../models/dailyEarn.model');
const RedUserEarning = require('../models/refUserEarn.model');
const { sendDailyProfitEmail } = require("./sendMailer");

// ✅ Round to 3 decimals
const roundTo3 = (num) => parseFloat(num.toFixed(3));

// ----------------------------------------
// NEW: Get previous UTC day "YYYY-MM-DD"
// ----------------------------------------
const getUTCPreviousDayString = () => {
  const now = new Date();
  const prev = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - 1
  ));
  return prev.toISOString().split("T")[0]; // example: "2025-12-20"
};

// Old function kept for referral lookup
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


// =======================================================
// MAIN FUNCTION
// =======================================================
exports.calculateDailyEarnings = async () => {
  const { start, end } = getUTCYesterdayRange();
  const prevDay = getUTCPreviousDayString(); // <-- NEW

  console.log("Calculating daily earnings for UTC range:", start, "to", end);

  const allUsers = await User.find({});

  for (const user of allUsers) {

    // ------------------------------------
    // ✔ NEW: Prevent duplicate earnings
    // ------------------------------------
    const existingRecord = await DailyEarn.findOne({
      userId: user._id,
      createdAt: {
        $gte: new Date(prevDay + "T00:00:00Z"),
        $lt: new Date(prevDay + "T23:59:59Z")
      }
    });

    if (existingRecord) {
      console.log(`⏩ Skipped ${user.name} — earnings for ${prevDay} already exist.`);
      continue;
    }

    // ============================
    //       ORIGINAL LOGIC
    // ============================

    const now = new Date();
    const currentInvested = roundTo3(user.investedAmount || 0);

    // 1) Mature pending lots
    let maturedPendingSum = 0;
    if (user.investedLots && user.investedLots.length > 0) {
      for (const lot of user.investedLots) {
        const hoursPassed = (now - new Date(lot.createdAt)) / (1000 * 60 * 60);
        if (lot.status === 'Pending' && hoursPassed >= 24) {
          maturedPendingSum += (lot.amount || 0);
        }
      }
    }

    const totalAfter = roundTo3(currentInvested + maturedPendingSum);
    if (totalAfter < 20) {
      console.log(`Skipping ${user.name} — total after matured pending (${totalAfter}) < 20.`);
      continue;
    }

    // 2) Update matured lots
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
      console.log(`✅ ${user.name}: matured Pending added = ${maturedPendingSum}`);
    }
    if (lotsUpdated) await user.save();

    // 3) Profit calculate
    const compareAmount = roundTo3(user.investedAmount || 0);
    const dailyProfit = roundTo3((compareAmount * 1) / 100);
    let totalRefEarnings = 0;

    // 4) Referral Earnings
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

    // --------------------------------------------
    // 5) NEW: Save Daily Record With Previous Date
    // --------------------------------------------
    await DailyEarn.create({
      userId: user._id,
      baseAmount: compareAmount,
      dailyProfit,
      refEarn: roundTo3(totalRefEarnings),

      // 🔥 store previous day as createdAt
      createdAt: new Date(prevDay + "T12:00:00Z")
    });

    // 6) Update totals
    user.totalBalance = roundTo3((user.totalBalance || 0) + dailyProfit + totalRefEarnings);
    user.refEarn = roundTo3((user.refEarn || 0) + totalRefEarnings);
    user.totalEarn = roundTo3((user.totalEarn || 0) + dailyProfit);

    await user.save();

    // --------------------------------------------
    // 7) NEW: Send Email With Previous Date
    // --------------------------------------------
    try {
      await sendDailyProfitEmail({
        userEmail: user.email,
        userName: user.name,
        amount: compareAmount || 0,
        dailyEarn: dailyProfit || 0,
        refEarn: totalRefEarnings || 0,

        // 🔥 send previous day in email
        date: prevDay
      });

      console.log(`📧 Email sent to ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${user.name}:`, error.message);
    }

    console.log(`✅ Updated ${user.name}: Profit=${dailyProfit}, Ref=${totalRefEarnings}`);
  }

  return { message: 'Daily earnings calculated and emails sent successfully (UTC based)' };
};
