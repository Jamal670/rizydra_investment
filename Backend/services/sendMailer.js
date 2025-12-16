import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "noreplyrizydra@gmail.com",
    pass: "fkoiwnldvdenlhpy",
  },
});

// Function to generate a 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ------------------------- OTP email -----------------------------------
export async function sendEmail(email, otp) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: email,
    subject: "Email Verification Code - Rizydra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        <div style="background-color: #1a73e8; color: white; padding: 16px; text-align: center;">
          <h2 style="margin: 0;">Rizydra Verification</h2>
        </div>

        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Dear User,</p>
          <p style="font-size: 15px; color: #555;">
            Thank you for registering with <strong>Rizydra</strong>!  
            Please use the verification code below to confirm your email address.
          </p>

          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background-color: #f4f4f4; border: 2px dashed #1a73e8; border-radius: 8px; padding: 14px 28px;">
              <span style="font-size: 28px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;">${otp}</span>
            </div>
          </div>

          <p style="font-size: 15px; color: #555;">
            Enter this code in the app to verify your account.  
            The code will expire shortly for your security.
          </p>

          <p style="font-size: 15px; color: #555;">If you didn’t request this code, please ignore this email.</p>

          <p style="margin-top: 25px; color: #333;">Best Regards,</p>
          <p style="font-weight: bold; color: #1a73e8;">Rizydra Team</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #888;">
          This is an automated message, please do not reply.
        </div>
      </div>
    `,
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

//---------------------------withdraw email otp ---------------------------------------
export async function withdrawOtpEmail(email, otp) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: email,
    subject: "Withdraw Verification Code - Rizydra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1a73e8; color: white; padding: 16px; text-align: center;">
          <h2 style="margin: 0;">Rizydra Security Verification</h2>
        </div>

        <!-- Body -->
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Dear User,</p>

          <p style="font-size: 15px; color: #555;">
            Enter this verification code in the application to confirm your withdrawal.
            This code is valid for a limited time only for your security.
          </p>
          
          <!-- OTP Box -->
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background-color: #f4f4f4; border: 2px dashed #1a73e8; border-radius: 8px; padding: 14px 28px;">
              <span style="font-size: 28px; font-weight: bold; color: #1a73e8; letter-spacing: 4px;">
                ${otp}
              </span>
            </div>
          </div>

          <p style="font-size: 15px; color: #d32f2f;">
            ⚠️ Do not share this code with anyone.
          </p>

          <p style="font-size: 15px; color: #555;">
            If you did not initiate this withdrawal request, please contact our support team immediately.
          </p>

          <p style="margin-top: 25px; color: #333;">Best Regards,</p>
          <p style="font-weight: bold; color: #1a73e8;">Rizydra Security Team</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 12px; color: #888;">
          This is an automated security message. Please do not reply.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Withdraw OTP email sent successfully",
      info,
    };
  } catch (err) {
    return { success: false, message: "Failed to send withdraw OTP email", error: err };
  }
}

//---------------------------Daily profit mail on every user-------------------------------
export async function sendDailyProfitEmail({ userEmail, userName, amount = 0, dailyEarn = 0, refEarn = 0, date }) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: userEmail,
    subject: "Daily Profit Summary - Rizydra",
    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
      <h2 style="color:#1a73e8;">💰 Your Daily Profit Report</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Here is your daily earning summary for <strong>${date}</strong>.</p>
      
      <table style="width:100%; border-collapse: collapse; margin-top:15px;">
        <tr>
          <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Total Investment</td>
          <td style="padding:8px; border:1px solid #ddd;">$${(amount || 0).toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Daily Profit</td>
          <td style="padding:8px; border:1px solid #ddd;">$${(dailyEarn || 0).toFixed(3)}</td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Referral Earning</td>
          <td style="padding:8px; border:1px solid #ddd;">$${(refEarn || 0).toFixed(3)}</td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Date</td>
          <td style="padding:8px; border:1px solid #ddd;">${date}</td>
        </tr>
      </table>

      <p style="margin-top:20px;">
        Keep investing and inviting friends to increase your daily and referral earnings.
      </p>

      <p>To check your full account details, 
        <a href="https://www.rizydra.com/login" target="_blank" style="color:#1a73e8;">log in here</a>.
      </p>

      <p>Thank you for being part of <strong>Rizydra</strong>!</p>

      <hr style="border:none; border-top:1px solid #e0e0e0; margin-top:25px;"/>
      <p style="font-size:12px; color:#888;">This is an automated message — please do not reply.</p>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Daily profit email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send daily profit email", error: err };
  }
}
// -------------------- admin withdraw email --------------------------
export async function sendAdminWithdrawEmail({
  user,
  exchangeType,
  amount,
  userExchange,
  type,
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: "rizydra@gmail.com", // Admin email
    subject: "New Withdraw Request - Rizydra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
        <h2 style="color:#1a73e8;">💰 New Withdraw Request</h2>
        <p>Dear <strong>Admin</strong>,</p>
        <p>A new withdraw request has been initiated by a user. Below are the details:</p>

        <table style="width:100%; border-collapse: collapse; margin-top:15px;">
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">User Name</td>
            <td style="padding:8px; border:1px solid #ddd;">${user.name}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Withdraw Type</td>
            <td style="padding:8px; border:1px solid #ddd;">${type}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Amount</td>
            <td style="padding:8px; border:1px solid #ddd;">$${amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Exchange Type</td>
            <td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">User Exchange Address</td>
            <td style="padding:8px; border:1px solid #ddd;">${userExchange}</td>
          </tr>
        </table>

        <p style="margin-top:20px;">
          Please review and process this withdrawal request as soon as possible.
        </p>

        <hr style="border:none; border-top:1px solid #e0e0e0; margin-top:25px;"/>
        <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Rizydra System — Secure Investment Platform</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Admin withdraw email sent successfully" };
  } catch (err) {
    return { success: false, message: "Failed to send admin withdraw email", error: err };
  }
}

// -------------------- user withdraw email --------------------------
export async function sendUserPendingWithdrawMail({
  user,
  amount,
  type,
  exchangeType,
  userExchange,
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: user.email,
    subject: "Withdraw Request Received - Rizydra",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; padding:20px; border-radius:8px;">
        <h2 style="color:#1a73e8;">💰 Withdraw Request Received</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>We’ve received your withdraw request. Below are the details for your reference:</p>

        <table style="width:100%; border-collapse: collapse; margin-top:15px;">
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Withdraw Type</td>
            <td style="padding:8px; border:1px solid #ddd;">${type}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Amount</td>
            <td style="padding:8px; border:1px solid #ddd;">$${amount.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Exchange Type</td>
            <td style="padding:8px; border:1px solid #ddd;">${exchangeType}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Your Exchange Address</td>
            <td style="padding:8px; border:1px solid #ddd;">${userExchange}</td>
          </tr>
        </table>

        <div style="margin-top:20px; background:#e8f3ff; border-left:4px solid #1a73e8; padding:15px; border-radius:6px;">
          <p style="font-size:14px; color:#333; margin:0;">
            ⏳ Your withdrawal request is under review and will be processed within <strong>24 hours</strong>.
          </p>
        </div>

        <div style="text-align:center; margin-top:25px;">
          <a href="https://www.rizydra.com/login" target="_blank" style="
            background: linear-gradient(90deg, #1a73e8, #4285f4);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            display: inline-block;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">Login to Dashboard</a>
        </div>

        <p style="margin-top:20px; font-size:14px; color:#555;">
          Thank you for choosing <strong>Rizydra</strong>. We truly appreciate your trust and patience.
        </p>

        <hr style="border:none; border-top:1px solid #e0e0e0; margin-top:25px;"/>
        <p style="font-size:12px; color:#888; text-align:center;">© ${new Date().getFullYear()} Rizydra System — Secure Investment Platform</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "User withdraw confirmation email sent" };
  } catch (err) {
    return { success: false, message: "Failed to send user withdraw email", error: err };
  }
}

//-------------------------------- send admin Deposit email-----------------------------
export async function sendAdminDepositEmail({
  user,
  exchangeType,
  ourExchange,
  amount,
  userExchange,
  image,
  type,
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: "rizydra@gmail.com", // Admin email
    subject: "New Deposit Request - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">💰 New Deposit Request</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>Admin</b>,</p>
          <p style="font-size: 15px; color: #333;">
            A new <b style="color:#2b6cb0;">deposit request</b> has been submitted by a user. Below are the details:
          </p>
          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>User Name:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Deposit Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Our Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${ourExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>User Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px;">
            <p style="font-size: 15px; color: #333; margin-bottom: 10px;"><b>Proof of Deposit:</b></p>
            <img src="data:image/png;base64,${image}" alt="Deposit Proof" width="300" style="border-radius: 8px; border: 1px solid #ddd;"/>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Please review and verify the deposit at your earliest convenience.
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Deposit email sent successfully" };
  } catch (err) {
    return { success: false, message: "Failed to send deposit email", error: err };
  }
}

//---------------------------send user pending deposit mail-----------------------------
export async function sendUserPendingDepositmail({
  user,
  amount,
  type,
  exchangeType,
  ourExchange,
  userExchange,
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: user.email, // Send to user's email
    subject: "Deposit Request Received - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">💰 Deposit Request Received</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>${user.name}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            We’ve received your <b style="color:#2b6cb0;">deposit request</b>. Below are the details for your reference:
          </p>

          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Deposit Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Our Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${ourExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Your Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; background: #e8f3ff; border-left: 4px solid #2b6cb0; padding: 15px; border-radius: 6px;">
            <p style="font-size: 14px; color: #333; margin: 0;">
              ⏳ Your deposit is under review and will be credited to your account within <b>24 hours</b>.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for choosing <b>Rizydra</b>. We truly appreciate your trust and patience.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Deposit confirmation email sent to user" };
  } catch (err) {
    return { success: false, message: "Failed to send confirmation email", error: err };
  }
}

//---------------------------- admin send deposite conformation email------------------
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
    from: "noreplyrizydra@gmail.com",
    to: userEmail,
    subject: "Deposit Accepted - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">💰 Deposit Accepted</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>${userName}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            Great news! Your <b style="color:#2b6cb0;">deposit request</b> has been successfully <b>accepted</b>.
            Below are your deposit details:
          </p>

          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Deposit Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Your Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Status:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd; color:#2b6cb0; font-weight:600;">${status}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; background: #e8f3ff; border-left: 4px solid #2b6cb0; padding: 15px; border-radius: 6px;">
            <p style="font-size: 14px; color: #333; margin: 0;">
              💵 Your deposit has been successfully added to your account balance. You can now start investing or trading securely on <b>Rizydra</b>.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for being part of <b>Rizydra</b>. We appreciate your trust in our platform.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
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

//------------------------------ admin decline deposite email-------------------------
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
    from: "noreplyrizydra@gmail.com",
    to: userEmail,
    subject: "Deposit Declined - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">⚠️ Deposit Declined</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>${userName}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            We regret to inform you that your <b style="color:#2b6cb0;">deposit request</b> has been <b>declined</b> by our verification team.
            Below are the details for your reference:
          </p>

          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Deposit Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Your Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Status:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd; color:#2b6cb0; font-weight:600;">${status}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Admin Comment:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${comment || "No additional comment provided."}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; background: #e8f3ff; border-left: 4px solid #2b6cb0; padding: 15px; border-radius: 6px;">
            <p style="font-size: 14px; color: #333; margin: 0;">
              💡 Please review your payment details or contact <b>Rizydra Support</b> if you believe this was an error.
              You may re-submit your deposit once the issue has been resolved.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for your patience and understanding.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
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

//-------------------------- send mail user withdraw accepted --------------------------
export async function sendWithdrawAcceptedEmail({
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status,
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: userEmail,
    subject: "Withdraw Accepted - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">

          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">💰 Withdraw Approved</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>${userName}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            Your <b style="color:#2b6cb0;">withdraw request</b> has been successfully <b>processed</b>. Below are the details:
          </p>

          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Withdraw Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Your Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Status:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd; color:#2b6cb0; font-weight:600;">${status}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; background: #e8f3ff; border-left: 4px solid #2b6cb0; padding: 15px; border-radius: 6px;">
            <p style="font-size: 14px; color: #333; margin: 0;">
              🎉 Your withdrawal has been successfully processed. The funds should arrive in your account shortly.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for using <b>Rizydra</b>. We appreciate your trust and support.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
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

//-------------------------- admin decline users withdraw mail--------------------------
export async function sendWithdrawDeclinedEmail({
  userEmail,
  userName,
  exchangeType,
  amount,
  userExchange,
  type,
  status,
  comment
}) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: userEmail,
    subject: "Withdraw Declined - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">

          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">💰 Withdraw Declined</h2>
          <p style="font-size: 15px; color: #333;">Dear <b>${userName}</b>,</p>
          <p style="font-size: 15px; color: #333;">
            Your <b style="color:#2b6cb0;">withdraw request</b> could not be processed. Please review the details below:
          </p>

          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Withdraw Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Amount:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Exchange Type:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${exchangeType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Your Exchange:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${userExchange}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Status:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd; color:#2b6cb0; font-weight:600;">${status}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><b>Comment:</b></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${comment || "No additional comment provided."}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; background: #e8f3ff; border-left: 4px solid #2b6cb0; padding: 15px; border-radius: 6px;">
            <p style="font-size: 14px; color: #333; margin: 0;">
              ⚠️ Please review your withdrawal details or contact <b>Rizydra Support</b> if you believe this was an error.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for using <b>Rizydra</b>. We appreciate your trust and support.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Withdraw declined email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send withdraw declined email", error: err };
  }
}

//--------------------------------- User accoutn update mail-----------------------------
export async function userAccountUpdate({ name, email, date }) {
  const mailOptions = {
    from: "noreplyrizydra@gmail.com",
    to: email,
    subject: "Account Update Notification - Rizydra",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f9fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
          <h2 style="color: #2b6cb0; text-align: center; margin-bottom: 20px;">🔔 Account Updated</h2>
          
          <p style="font-size: 15px; color: #333;">Dear <b>${name}</b>,</p>
          
          <p style="font-size: 15px; color: #333;">
            Your account was updated on <b>${date}</b>. If you wish to review your account details, please log in to your dashboard.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://rizydra.com/login" target="_blank" style="
              background: linear-gradient(90deg, #2b6cb0, #4299e1);
              color: white;
              text-decoration: none;
              padding: 12px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              display: inline-block;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            ">Login to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #555; margin-top: 25px;">
            Thank you for using <b>Rizydra</b>.
          </p>

          <p style="font-size: 14px; color: #555;">
            Regards,<br/>
            <b style="color:#2b6cb0;">Rizydra Support Team</b>
          </p>

          <hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee;"/>
          <p style="font-size: 13px; color:#888; text-align:center;">
            © ${new Date().getFullYear()} Rizydra System — Secure Investment Platform
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Account update email sent", info };
  } catch (err) {
    return { success: false, message: "Failed to send account update email", error: err };
  }
}

//-------------------------generating Token in required time period-----------------------------------
export function generateToken(tokenData, secretKey, jwtExpiry) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpiry });
}

