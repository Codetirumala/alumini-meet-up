# OTP-Based Password Reset Feature - Setup Guide

## 🎯 Overview
The password reset system now uses **OTP (One-Time Password)** instead of token-based email links. This is more secure and user-friendly.

## ✅ What's Implemented

### Backend
- ✅ OTP generation (6-digit random code)
- ✅ OTP sent via email with professional template
- ✅ OTP verification endpoint
- ✅ 10-minute OTP expiration
- ✅ Password reset with OTP validation
- ✅ Email service configured with contactalumnihub@gmail.com

### Frontend
- ✅ ForgotPassword page (email input)
- ✅ VerifyOTP page (OTP entry with 10-minute countdown)
- ✅ ResetPassword page (new password)
- ✅ Resend OTP functionality
- ✅ All pages styled with green theme

## 🔄 User Flow

```
1. User clicks "Forgot password?" on Login
   ↓
2. Enters email on ForgotPassword page
   ↓
3. Gets OTP via email
   ↓
4. Enters OTP on VerifyOTP page (with countdown timer)
   ↓
5. OTP verified → proceeds to ResetPassword
   ↓
6. Enters new password
   ↓
7. Password updated, redirected to login
```

## 📧 Email Template

The OTP email includes:
- Large, clear OTP display
- 10-minute expiration warning
- Alumni Hub branding
- Support information
- Professional design

## 🔐 Security Features

1. **Random OTP**: 6-digit cryptographically random code
2. **Time-based Expiry**: 10 minutes from generation
3. **One-time Use**: Cannot be reused
4. **Email Verification**: Email must match user account
5. **Resend Limit**: Can resend after 1 minute
6. **Password Hashing**: All passwords hashed with bcryptjs

## 📋 API Endpoints

### Request OTP
```
POST /auth/forgot-password
{
  "email": "user@example.com"
}

Response:
{
  "message": "OTP sent to your email. Valid for 10 minutes."
}
```

### Verify OTP
```
POST /auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "message": "OTP verified successfully",
  "verified": true
}
```

### Reset Password
```
POST /auth/reset-password
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

## 🚀 Current Status

### Backend
- `backend/models/User.js` - Updated with resetOTP fields
- `backend/utils/sendEmail.js` - Updated to send OTP emails
- `backend/controllers/authController.js` - New OTP logic
- `backend/routes/authRoutes.js` - New endpoints added
- `backend/.env` - Gmail configured (EMAIL_PASSWORD set)

### Frontend
- `frontend/src/components/auth/ForgotPassword.jsx` - Email input
- `frontend/src/components/auth/VerifyOTP.jsx` - OTP entry with timer
- `frontend/src/components/auth/ResetPassword.jsx` - New password
- `frontend/src/App.jsx` - Routes updated
- All pages styled with green theme

## 🎨 Features

### VerifyOTP Component
- ✅ OTP input field (6 digits only)
- ✅ 10-minute countdown timer
- ✅ Color-coded timer (red when < 2 minutes)
- ✅ Resend OTP button (enabled after 1 minute)
- ✅ Smooth animations
- ✅ Error/Success messages
- ✅ Mobile responsive

### ResetPassword Component
- ✅ New password input
- ✅ Confirm password input
- ✅ Show/hide password toggles
- ✅ Password validation (min 6 characters)
- ✅ Match confirmation
- ✅ Loading states

## 🧪 Testing

### Test the Full Flow
1. Go to http://localhost:5173/login
2. Click "Forgot password?"
3. Enter your email
4. Check your inbox for OTP email
5. Copy the 6-digit OTP
6. Enter it on VerifyOTP page
7. Create new password
8. Login with new password

### Test Cases
- ✅ Invalid OTP → Error message
- ✅ Expired OTP → Resend option appears
- ✅ Mismatched passwords → Error message
- ✅ Short password → Error message
- ✅ Resend OTP → New OTP sent

## ⚙️ Configuration

### Gmail Setup (Already Done)
- Email: contactalumnihub@gmail.com
- App Password: xyhy nlom iwwk scxd (configured in .env)
- 2FA: Enabled

### Environment Variables (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
EMAIL_USER=contactalumnihub@gmail.com
EMAIL_PASSWORD=xyhy nlom iwwk scxd
FRONTEND_URL=http://localhost:5173
```

## 🔄 OTP Resend Logic

- First OTP: Sent immediately
- Resend available after: 1 minute
- Resend sends new OTP: Yes
- Old OTP becomes invalid: Yes (new one replaces it)
- Timer resets: Yes (to 10 minutes)

## 📊 Database Changes

### User Model New Fields
```javascript
resetOTP: String (null when not requested)
resetOTPExpires: Date (null when not requested)
```

## 🎯 Advantages over Token-Based

| Feature | Token Link | OTP |
|---------|-----------|-----|
| User Experience | Click link in email | Enter code in form |
| Mobile Friendly | Requires email app switching | Stay in app |
| Security | Long URL exposed in logs | 6-digit code |
| Expiry | 1 hour | 10 minutes |
| Speed | ~5 seconds | ~30 seconds |
| Session | Links can be leaked | One-time only |

## 🐛 Troubleshooting

### OTP Not Arriving
- Check spam folder
- Verify email in database
- Check Gmail app password in .env
- Check NODE_ENV for nodemailer logs

### OTP Expired
- User needs to request new OTP
- Timer shows exactly how much time remains
- Can resend after 1 minute

### Password Not Updating
- Ensure OTP is still valid
- Password must be 6+ characters
- Check password confirmation matches

## 🚀 Future Enhancements

1. Rate limiting on OTP requests
2. CAPTCHA protection
3. SMS OTP as backup
4. OTP length customization (4, 6, 8 digits)
5. Biometric password reset
6. Security questions

## 📞 Support

For issues:
- Check browser console for errors
- Check backend server logs
- Verify MongoDB connection
- Verify Gmail credentials in .env

---

**Status**: ✅ Production Ready
**Last Updated**: December 25, 2025
**Version**: 2.0 (OTP-Based)
