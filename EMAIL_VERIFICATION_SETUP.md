# Email Verification Setup Guide

## Overview

Email verification has been integrated into the signup flow. Users must verify their email before they can log in to the application.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Other existing variables
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET_KEY=your-jwt-secret-key
```

### 2. Gmail Setup (if using Gmail)

1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled
3. Go to App Passwords section (appears only after 2FA is enabled)
4. Create an app password for "Mail" and "Windows Computer"
5. Copy the 16-character password and use it as `EMAIL_PASSWORD` in `.env.local`

**Note:** Do not use your regular Gmail password for the `EMAIL_PASSWORD` variable.

### 3. Alternative Email Providers

If using a different email provider, modify the transporter in `/utils/sendEmail.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: "your-email-provider-smtp.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Signup Flow

1. **User enters email and password**
   - Email is validated for proper format
   - Password minimum length is 6 characters

2. **Account creation**
   - User record is created with `isVerified: false`
   - Verification token is generated and stored
   - Token expires in 24 hours

3. **Verification email sent**
   - Email with verification link is sent to the user
   - Link includes the verification token

4. **User clicks verification link**
   - User is directed to `/verify-email?token={token}`
   - Token is validated
   - Account is marked as verified

5. **Login available**
   - User can now log in with their credentials
   - System checks `isVerified` before allowing login

## Features

✓ Email format validation  
✓ 24-hour token expiration  
✓ Beautiful email template  
✓ User-friendly verification page  
✓ Error handling for expired tokens  
✓ Login blocked until email is verified  
✓ Original design preserved

## Files Modified/Created

- **Modified:**
  - `/models/owner.js` - Added email and verification fields
  - `/app/api/signup/route.js` - Email validation and verification flow
  - `/app/signup/page.jsx` - Updated UI with verification feedback
  - `/app/api/login/route.js` - Added email verification check

- **Created:**
  - `/utils/sendEmail.js` - Email sending utility
  - `/utils/tokenUtils.js` - Token generation and email validation
  - `/app/api/verify-email/route.js` - Email verification endpoint
  - `/app/verify-email/page.jsx` - Email verification page

## Dependencies Added

- `nodemailer` - For sending emails

## Testing

1. Start the development server: `npm run dev`
2. Go to http://localhost:3000/signup
3. Enter a valid email and password
4. Check your email for the verification link
5. Click the link to verify
6. Log in with your credentials

## Troubleshooting

**Email not sending:**

- Verify environment variables are set correctly
- Check if using Gmail with app-specific password (not regular password)
- Ensure "Less secure app access" is not blocking the connection

**Verification link not working:**

- Check if NEXT_PUBLIC_APP_URL matches your current domain
- Verify token hasn't expired (24-hour limit)
- Clear browser cache and try again

**Token expired:**

- User can sign up again to get a new token
- Tokens are automatically deleted after verification

## Notes

- The original signup design and styling have been preserved
- Email validation is performed on both frontend and backend
- Passwords are still securely hashed with bcryptjs
- Session management remains unchanged
- All existing operations continue to work normally
