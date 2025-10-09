import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "jamalobaid2@gmail.com",
    pass: "unrowxvldcakxukm",
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

export async function sendWithdrawEmail(userId, amount, exchangeType, userExchange, type) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: "noreplyrizydra0@gmail.com", // Always send here
    subject: "New Withdraw Request <Rizydra>",
    text: `Dear Admin,
    
A new withdrawal request has been initiated.

Details:
- Withdraw Type: ${type}
- Amount: ${amount}
- Exchange Type: ${exchangeType}
- User Exchange: ${userExchange}
- User ID (non-sensitive): ${userId}


Please review this request.

Thank you,
Rizydra System
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Withdraw email sent successfully",
      info,
    };
  } catch (err) {
    return { success: false, message: "Failed to send withdraw email", error: err };
  }
}

// ✅ Deposit Email Function
export async function sendDepositEmail({
  user,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  image,
  type,
}) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: "noreplyrizydra0@gmail.com", // admin email
    subject: "New Deposit Request <Rizydra>",
    html: `
      <h3>Dear Admin,</h3>
      <p>A new <b>deposit request</b> has been initiated.</p>
      <h4>Details:</h4>
      <ul>
        <li><b>User Name:</b> ${user.name}</li>
        <li><b>Deposit Type:</b> ${type}</li>
        <li><b>Amount:</b> ${amount}</li>
        <li><b>Exchange Type:</b> ${exchangeType}</li>
        <li><b>Our Exchange:</b> ${ourExchange}</li>
        <li><b>User Exchange:</b> ${userExchange}</li>
      </ul>
      <p><b>Proof Image:</b></p>
      <img src="data:image/png;base64,${image}" alt="Deposit Proof" width="300"/>
      <br/><br/>
      <p>Thank you,<br/>Rizydra System</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Deposit email sent successfully" };
  } catch (err) {
    return { success: false, message: "Failed to send deposit email", error: err };
  }
};

export async function sendDepositAcceptedEmail(
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status
) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: userEmail,
    subject: "Deposit Accepted - Rizydra",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
      <h2 style="color:#4CAF50;">Deposit Accepted ✅</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Your deposit request has been successfully <strong>accepted</strong>.</p>
      <h4>Deposit Details:</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border:1px solid #ddd;">Type</td><td style="padding:8px; border:1px solid #ddd;">${type}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Amount</td><td style="padding:8px; border:1px solid #ddd;">${amount}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Exchange Type</td><td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">User Exchange</td><td style="padding:8px; border:1px solid #ddd;">${userExchange}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Status</td><td style="padding:8px; border:1px solid #ddd;">${status}</td></tr>
      </table>
      <p style="margin-top:20px;">To view your deposit details and account balance, <a href="https://www.rizydra.com/login" target="_blank" style="color:#1a73e8;">log in here</a>.</p>
      <p>Thank you for using <strong>Rizydra</strong>.</p>
      <hr style="border:none; border-top:1px solid #e0e0e0;"/>
      <p style="font-size:12px; color:#888;">This is an automated message. Please do not reply.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Deposit accepted email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send deposit accepted email", error: err };
  }
}

export async function sendDepositDeclinedEmail(
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status,
  comment
) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: userEmail,
    subject: "Deposit Declined - Rizydra",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
      <h2 style="color:#f44336;">Deposit Declined ❌</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Your deposit request has been <strong>declined</strong>.</p>
      <h4>Deposit Details:</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border:1px solid #ddd;">Type</td><td style="padding:8px; border:1px solid #ddd;">${type}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Amount</td><td style="padding:8px; border:1px solid #ddd;">${amount}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Exchange Type</td><td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">User Exchange</td><td style="padding:8px; border:1px solid #ddd;">${userExchange}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Status</td><td style="padding:8px; border:1px solid #ddd;">${status}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Comment</td><td style="padding:8px; border:1px solid #ddd;">${comment}</td></tr>
      </table>
      <p style="margin-top:20px;">For more information, please <a href="https://www.rizydra.com/login" target="_blank" style="color:#1a73e8;">log in here</a> or contact support.</p>
      <p>Thank you for using <strong>Rizydra</strong>.</p>
      <hr style="border:none; border-top:1px solid #e0e0e0;"/>
      <p style="font-size:12px; color:#888;">This is an automated message. Please do not reply.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Deposit declined email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send deposit declined email", error: err };
  }
}

export async function sendWithdrawAcceptedEmail(
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status
) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: userEmail,
    subject: "Withdraw Accepted - Rizydra",
    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
      <h2 style="color:#4CAF50;">Withdraw Accepted ✅</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Your withdraw request has been successfully <strong>processed</strong>.</p>
      <h4>Withdraw Details:</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border:1px solid #ddd;">Type</td><td style="padding:8px; border:1px solid #ddd;">${type}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Amount</td><td style="padding:8px; border:1px solid #ddd;">${amount}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Exchange Type</td><td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">User Exchange</td><td style="padding:8px; border:1px solid #ddd;">${userExchange}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Status</td><td style="padding:8px; border:1px solid #ddd;">${status}</td></tr>
      </table>
      <p style="margin-top:20px;">To view your account balance, <a href="https://www.rizydra.com/login" target="_blank" style="color:#1a73e8;">log in here</a>.</p>
      <p>Thank you for using <strong>Rizydra</strong>.</p>
      <hr style="border:none; border-top:1px solid #e0e0e0;"/>
      <p style="font-size:12px; color:#888;">This is an automated message. Please do not reply.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Withdraw accepted email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send withdraw accepted email", error: err };
  }
}

export async function sendWithdrawDeclinedEmail(
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status,
  comment
) {
  const mailOptions = {
    from: "jamalobaid2@gmail.com",
    to: userEmail,
    subject: "Withdraw Declined - Rizydra",
    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
      <h2 style="color:#f44336;">Withdraw Declined ❌</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Your withdraw request has been <strong>declined</strong>.</p>
      <h4>Withdraw Details:</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:8px; border:1px solid #ddd;">Type</td><td style="padding:8px; border:1px solid #ddd;">${type}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Amount</td><td style="padding:8px; border:1px solid #ddd;">${amount}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Exchange Type</td><td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">User Exchange</td><td style="padding:8px; border:1px solid #ddd;">${userExchange}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Status</td><td style="padding:8px; border:1px solid #ddd;">${status}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd;">Comment</td><td style="padding:8px; border:1px solid #ddd;">${comment}</td></tr>
      </table>
      <p style="margin-top:20px;">For more information, please <a href="https://www.rizydra.com/login" target="_blank" style="color:#1a73e8;">log in here</a> or contact support.</p>
      <p>Thank you for using <strong>Rizydra</strong>.</p>
      <hr style="border:none; border-top:1px solid #e0e0e0;"/>
      <p style="font-size:12px; color:#888;">This is an automated message. Please do not reply.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Withdraw declined email sent successfully",
      info,
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to send withdraw declined email",
      error: err,
    };
  }
}




//-------------------------generating Token in required time period-----------------------------------
export function generateToken(tokenData, secretKey, jwtExpiry) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpiry });
}

