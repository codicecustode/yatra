import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    throw new Error('Mail Server connection failed');
  } else {
    console.log('--->Mail Server is ready to send emails');
  }
});

/**
 * Sends a unique One-Time Password (OTP)
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"Yatra Car Support" <${process.env.EMAIL_USER}>`,
    to: email, // Use the variable 'email' passed to the function
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your Account</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #4CAF50; font-size: 40px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #777; font-size: 12px; margin-top: 20px;">
          This code is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`---> OTP successfully sent to ${email}`);
  } catch (error) {
    throw new Error('Failed to send verification email.');
  }
};