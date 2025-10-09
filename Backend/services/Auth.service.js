const bcrypt = require("bcryptjs");
const UserModel = require('../models/user.model');
const ContactModel = require('../models/contactUs.model');
const { sendEmail, generateOTP, generateToken } = require('./sendMailer');

// Generate unique referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// -----------------Register a new user---------------------  
exports.RegUser = async (name, email, password, referralCode) => {
  // Check if there is a pending user with OTP for same credentials
  const pendingUser = await UserModel.findOne({
    $or: [{ email }, { name }],
    status: 'Pending',
    otp: { $ne: null }
  });

  if (pendingUser) {
    console.log(`Deleting pending user with id: ${pendingUser._id}`);
    await UserModel.deleteOne({ _id: pendingUser._id });
  } else {
    // Regular check for existing verified user
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { name }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists');
      }
      if (existingUser.name === name) {
        throw new Error('Name already exists');
      }
    }
  }

  let referredBy = null;
  let referralLevel = 0;

  if (referralCode) {
    const referrer = await UserModel.findOne({ referralCode });

    if (!referrer) {
      throw new Error('Invalid referral code');
    }

    if (referrer.investedAmount < 20) {
      throw new Error('Your referrer must have a minimum investment of 20 USDT.');
    }

    referredBy = referrer._id;
    referralLevel = referrer.referralLevel === 3 ? 3 : referrer.referralLevel + 1;
  }

  const generatedReferralCode = generateReferralCode();
  const otp = generateOTP();

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    referralCode: generatedReferralCode,
    referredBy,
    referralLevel,
    otp,
    status: 'Pending'
  });

  const savedUser = await newUser.save();

  // Send OTP email completely in background (non-blocking)
  await sendEmail(email, otp);

  // Immediate response without waiting for email
  return {
    message: 'User registered successfully. OTP will be sent to your email shortly.',
    user: {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      referralCode: savedUser.referralCode,
      referralLevel: savedUser.referralLevel,
      status: savedUser.status
    }
  };
};



//------------Verify OTP----------------
exports.VerifyOtp = async (_id, otp, type) => {
  const user = await UserModel.findById(_id);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  // Clear OTP after verification
  user.otp = null;

  if (type === "fgt") {
    // Forgot password flow
    await user.save();
    return {
      message: "OTP verified for password reset",
      _id: user._id,
      type: "fgt"
    };
  }

  if (type === "reg") {
    // Registration flow
    user.status = "Verified";
    await user.save();

    // ---- REFERRAL CHAIN HANDLING ----
    let currentUser = user;
    let level = 1; // Start at level 1 for direct referrer

    // Go up the referral chain (max 3 levels)
    while (currentUser.referredBy && level <= 3) {
      const referrer = await UserModel.findById(currentUser.referredBy);
      if (!referrer) break; // No more referrers

      // Add this user to the referrer's referredUsers array if not already present
      const alreadyAdded = referrer.referredUsers.some(
        (r) => r.userId?.toString() === user._id.toString()
      );

      if (!alreadyAdded) {
        referrer.referredUsers.push({
          userId: user._id,
          refLevel: level,
        });
        await referrer.save();
      }

      // Move up to the next referrer
      currentUser = referrer;
      level++;
    }

    return {
      message: "User verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referralLevel: user.referralLevel,
        status: user.status,
        type: "reg"
      },
    };
  }

  throw new Error("Invalid type provided"); // in case type is neither fgt nor reg
};

//---------------resend------------------------
exports.ResendOtp = async (_id) => {
  console.log(`Resending OTP to user with ID: ${_id}`);

  // 1. Find user by ID
  const user = await UserModel.findById(_id);
  if (!user) {
    throw new Error('User not found');
  }

  // // 2. Check if user is verified
  // if (user.status !== 'Verified') {
  //   throw new Error('User not verified');
  // }

  // 3. Generate new OTP
  const newOtp = generateOTP();
  user.otp = newOtp;
  await user.save();

  // 4. Send new OTP via email
  await sendEmail(user.email, newOtp);

  return {
    message: 'New OTP sent successfully. Please check your email.',
    _id: user._id
  };
};

//---------------Login------------------------
exports.Login = async (identifier, password) => {
  console.log(`Logging in user with identifier: ${identifier}`);
  console.log(`Logging in user with identifier: ${password}`);

  // 1. Find user by email OR username
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { name: identifier }]
  });
  console.log(user);
  

  if (!user) { 
    throw new Error('User not found');
  }

  // 2. Check if user is verified
  if (user.status !== 'Verified') {
    throw new Error('User not verified');
  }

    // 3. Check password using bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

  // 4. Return minimal safe user data
  return {
    _id: user._id,
    email: user.email,
    name: user.name
  };
};

//---------------forget password send otp------------------------
exports.ForgotPassSendEmail = async (email) => {
  try {
    console.log(`Sending OTP for password reset to user: ${email}`);

    // 1. Find user by email
    const user = await UserModel.findOne({ email });  
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // 2. Check if user is verified
    if (user.status !== "Verified") {
      throw new Error("Invalid Credentials");
    }

    // 3. Generate OTP
    const otp = generateOTP();

    // 4. Save OTP in user record
    user.otp = otp;
    await user.save();

    // 5. Send OTP via email
    await sendEmail(email, otp);

    return {
      message: "OTP sent successfully. Please check your email.",
      _id: user._id
    };
  } catch (error) {
    console.error("ForgotPass Error:", error.message);
    throw error;
  }
};


//---------------forget password------------------------
exports.ForgotPass = async (userId, newPassword) => {
  try {
    console.log(`Resetting password for user: ${userId}`);

    // 1. Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // 2. Check if user is verified
    if (user.status !== "Verified") {
      throw new Error("Invalid Credentials");
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password
    user.password = hashedPassword;
    await user.save();

    return {
      message: "Password reset successful",
      _id: user._id
    };
  } catch (error) {
    console.error("ForgotPass Error:", error.message);
    throw error;
  }
};

//---------------contact us------------------------
exports.contactUs = async (name, email, phone, message) => {
  try {
    const contact = new ContactModel({ name, email, phone, message });
    await contact.save();
    return {
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Contact Us Error:", error.message);
    throw error;
  }
};

