import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jamalobaid2@gmail.com",
    pass: "zbkfkmfljxupnwoo",
  },
});

// Function to generate a 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to send email with status check
export async function sendEmail(email, otp) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: email,
    subject: "Your Email Verification Code",
    text: `Dear User,
  
  Your verification code is: ${otp}
  
  Please enter this code to verify your email address.

  Thank you,
  Rizydra Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
      info,
      otp,
    };
  } catch (err) {
    return { success: false, message: "Failed to send email", error: err };
  }
}

//-------------------------generating Token in required time period-----------------------------------
export function generateToken(tokenData, secretKey, jwtExpiry) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpiry });
}

