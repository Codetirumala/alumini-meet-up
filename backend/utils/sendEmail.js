const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'contactalumnihub@gmail.com',
    pass: process.env.EMAIL_PASSWORD, // Use app-specific password from Gmail
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'contactalumnihub@gmail.com',
      to: email,
      subject: 'Your Password Reset OTP - Alumni Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #10B981; margin: 0; font-size: 28px;">Alumni Hub</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Password Reset OTP</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <p style="color: #1f2937; font-size: 16px; margin: 0 0 15px 0;">
                Hello,
              </p>
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                We received a request to reset your password. Use the OTP below to proceed with resetting your password.
              </p>
              <p style="color: #4b5563; font-size: 13px; margin: 0 0 20px 0;">
                <strong>This OTP will expire in 10 minutes.</strong>
              </p>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 4px;">
                ${otp}
              </div>
            </div>

            <div style="background-color: #f3f4f6; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Enter this OTP on the password reset page to verify your identity.
              </p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                If you didn't request a password reset, please ignore this email or contact our support team.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                Best regards,<br/>Alumni Hub Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };
