const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

//Require routes
const dailyEarningService = require('./services/dailyEarning.service'); // Daily earnings service
const authRoutes = require('./routers/Auth.Router'); 
const userRoutes = require('./routers/user.Router');

// Initialize express app
const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 }));
app.use(express.json());

// ✅ Cron Job: Har din raat 12 baje run hoga
cron.schedule('5 0 * * *', async () => {
  console.log('⏳ Running Daily Earnings Calculation...');
  try {
    await dailyEarningService.calculateDailyEarnings();
    console.log('✅ Daily earnings calculated successfully');
  } catch (err) {
    console.error('❌ Error in daily earnings calculation:', err);
  }
});



const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "https://your-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or in the list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/', authRoutes); // authentation path
app.use('/user', userRoutes); // user_dashboard path

module.exports = app;
