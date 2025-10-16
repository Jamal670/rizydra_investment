const userAuthService = require('../services/Auth.service');
const { generateToken } = require('../services/sendMailer');

//------------Register User----------------
exports.RegUser = async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    const result = await userAuthService.RegUser(name, email, password, referralCode);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//------------Verify OTP----------------
exports.VerifyOtp = async (req, res) => {
  try {
    const _id = req.params.id;
    const { otp, type } = req.body;
    console.log(req.body, _id);
    const result = await userAuthService.VerifyOtp(_id, otp, type);
    res.status(200).json(result);
  } catch (err) {
    // console.error("VerifyOtp error:", err); 
    res.status(500).json({ error: err.message });
  }
};

//------------resend OTP----------------
exports.ResendOtp = async (req, res) => {
  try {
    const _id = req.params.id;   // <-- FIXED
    console.log(_id);            // Should now log: 68af01b2621c7e88390b2e71
    const result = await userAuthService.ResendOtp(_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//---------------Login------------------------
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Call service
    const user = await userAuthService.Login(email, password);

    if (user.email === "rizydra342@gmail.com") {
      res.status(200).json({
        message: 'User logged in successfully',
        user
      });
    }
    else {
      // Create token payload
      const tokenPayload = { _id: user._id, email: user.email };
      const token = generateToken(tokenPayload, process.env.JWT_SECRET, process.env.HOURS); // Increased to 24 hours

      // Store in HttpOnly cookie for security
      res.cookie("token", token, {
        httpOnly: true,   // ✅ make it secure
        secure: true,
        sameSite: "none", // agar frontend aur backend alag domains pe hain
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
      });

      res.status(200).json({
        message: 'User logged in successfully',
        user,
        token
      });
    }


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//---------------logout------------------------
exports.Logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token");
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//---------------forgot password send otp------------------------
// controllers/Authentication.controller.js
exports.ForgotPassSendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await userAuthService.ForgotPassSendEmail(email);
    res.status(200).json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//---------------forgot password------------------------
exports.ForgotPass = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    // Call service to handle forgot password logic
    const result = await userAuthService.ForgotPass(userId, newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//---------------contact us------------------------
exports.contactUs = async (req, res) => {
  try {
    const { name, email,phone, message } = req.body;
    const result = await userAuthService.contactUs(name, email, phone, message);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

