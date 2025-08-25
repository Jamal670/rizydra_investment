const dailyEarningService = require('../services/dailyEarning.service');

exports.runDailyEarningCalculation = async (req, res) => {
  try {
    const result = await dailyEarningService.calculateDailyEarnings();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
 