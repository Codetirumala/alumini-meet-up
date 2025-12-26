# Forgot Password Feature - Implementation Guide

## Overview
The forgot password feature has been fully implemented in both backend and frontend. Users can request a password reset via email and create a new password using a secure token-based link.

## Backend Setup

### 1. Dependencies
- **nodemailer**: Email sending library (already added to package.json)

Install the new dependency:
```bash
npm install
```

### 2. Environment Variables
Update your backend `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=contactalumnihub@gmail.com
EMAIL_PASSWORD=your_app_specific_password
FRONTEND_URL=http://localhost:5173
```

#### Gmail Configuration (Important!)
Since you're using Gmail (contactalumnihub@gmail.com), you need to:

1. **Enable 2-Factor Authentication** in your Gmail account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password to `EMAIL_PASSWORD` in `.env`

3. **Do NOT use your regular Gmail password** - it must be the app-specific password

### 3. Database Model Update
The User model has been updated with two new fields:
- `resetPasswordToken`: Stores the hashed reset token
- `resetPasswordExpires`: Stores when the token expires (1 hour)

### 4. New Backend Files

#### `/backend/utils/sendEmail.js`
Handles all email sending functionality with a professional email template.

#### `/backend/controllers/authController.js` (Updated)
Two new functions added:
- `forgotPassword()`: Generates reset token and sends email
- `resetPassword()`: Validates token and updates password

#### `/backend/routes/authRoutes.js` (Updated)
Two new endpoints:
- `POST /auth/forgot-password`: Request password reset
- `POST /auth/reset-password`: Reset password with token

### 5. API Endpoints

#### Request Password Reset
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset link sent to your email"
}
```

#### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email_link",
  "newPassword": "newPassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

## Frontend Setup

### 1. New Components

#### `/frontend/src/components/auth/ForgotPassword.jsx`
- Email input form
- Professional UI matching Login/Register pages
- Green theme consistency
- Success message with redirect to login

#### `/frontend/src/components/auth/ResetPassword.jsx`
- Password input with confirm password
- Token validation (from URL parameter)
- Show/hide password toggles
- Matches the authentication UI design

### 2. Updated Files

#### `/frontend/src/components/auth/Login.jsx`
- Forgot password link now navigates to `/forgot-password` route

#### `/frontend/src/App.jsx`
- Added route: `/forgot-password` → ForgotPassword component
- Added route: `/reset-password/:token` → ResetPassword component

## User Flow

### 1. User Initiates Password Reset
- User clicks "Forgot password?" on login page
- Redirected to `/forgot-password`
- Enters email address
- System sends reset email with token link

### 2. Email Received
- User receives professional email from contactalumnihub@gmail.com
- Email contains:
  - Reset button link
  - Plain text link as backup
  - 1-hour expiry warning
  - Support information

### 3. User Resets Password
- User clicks link in email
- Redirected to `/reset-password/{token}`
- Enters new password and confirms it
- Password is updated in database
- Redirect to login page

## Email Template
The email includes:
- Professional Alumni Hub branding
- Clear instructions
- Prominent reset button
- Fallback plain text link
- Expiry information
- Support contact information
- Responsive design

## Security Features

1. **Token Hashing**: Reset tokens are hashed before storage
2. **Time-based Expiry**: Tokens expire after 1 hour
3. **One-time Use**: Tokens are cleared after successful reset
4. **Password Hashing**: New passwords are hashed with bcryptjs
5. **SSL/TLS**: Email transmission is encrypted
6. **Validation**: Email and token validation on all endpoints

## Testing the Feature

### Local Testing (Development)

For testing without real Gmail:
1. Use Ethereal (free SMTP testing):
   ```bash
   npm install ethereal-email
   ```
2. Or use Mailtrap.io for testing

### Production Setup

1. Install nodemailer dependencies: `npm install` (in backend)
2. Configure Gmail app password in `.env`
3. Set `FRONTEND_URL` to your production domain
4. Test with actual email address
5. Monitor email delivery logs

## Troubleshooting

### Email Not Sending
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Verify email is not blocked by Gmail

### Token Expired
- Token automatically expires after 1 hour
- User needs to request new reset link
- This is by design for security

### Token Not Found
- Token may be expired
- User may have used it already
- Frontend URL must match `FRONTEND_URL` in backend .env

## Production Checklist

- [ ] Configure Gmail app password
- [ ] Add FRONTEND_URL to .env
- [ ] Set up error logging/monitoring
- [ ] Test email delivery
- [ ] Set up backup email service (optional)
- [ ] Configure rate limiting on forgot-password endpoint (optional)
- [ ] Add CAPTCHA protection (optional for security)

## Future Enhancements

1. **Rate Limiting**: Prevent spam reset requests
2. **Email Verification**: Verify email before reset
3. **SMS Backup**: Alternative reset method via SMS
4. **Security Questions**: Additional verification layer
5. **Email Confirmation**: Notify user when password changed
6. **Activity Logging**: Track password reset attempts

## Support Email Setup

The feature uses `contactalumnihub@gmail.com`. For additional support email features:
- Consider setting up a proper business email service (SendGrid, Mailgun)
- Implement email templates with more customization
- Add email delivery tracking and logging
