# Authentication System Setup Guide

This guide will walk you through setting up the authentication system step by step.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- Basic understanding of Next.js and React

## Step 1: Supabase Project Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the project details:
   - **Name:** Choose a name for your project
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose the closest region to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

### Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### Configure Authentication Settings

1. Go to **Authentication** > **Providers** in the sidebar
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings:
   - **Enable email confirmations:** Toggle ON if you want users to verify their email
   - **Secure email change:** Toggle ON for additional security

### Set Up Email Templates

1. Go to **Authentication** > **Email Templates**
2. Update the following templates:

#### Confirm Signup Template
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

#### Reset Password Template
```html
<h2>Reset your password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
```

3. Update the redirect URLs in **Authentication** > **URL Configuration**:
   - **Site URL:** `http://localhost:3000` (for development)
   - **Redirect URLs:** Add:
     - `http://localhost:3000/api/auth/callback`
     - `http://localhost:3000/reset-password`

## Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important:** Never commit `.env.local` to version control!

## Step 3: Verify Installation

1. Make sure all dependencies are installed:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 4: Test the Authentication Flow

### Test Sign Up

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Enter a test email and password
3. The password must meet these requirements:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character
4. Click "Create Account"
5. If email confirmation is enabled, check your email for a confirmation link
6. You should be redirected to the dashboard

### Test Login

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter the email and password you just created
3. Click "Log In"
4. You should be redirected to the dashboard

### Test Password Reset

1. Navigate to [http://localhost:3000/forgot-password](http://localhost:3000/forgot-password)
2. Enter your email address
3. Click "Send Reset Link"
4. Check your email for the reset link
5. Click the link to go to the reset password page
6. Enter a new password
7. Click "Reset Password"
8. You should be redirected to login
9. Log in with your new password

### Test Protected Routes

1. While logged in, navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2. You should see your dashboard with user information
3. Click "Logout"
4. Try to access [http://localhost:3000/dashboard](http://localhost:3000/dashboard) again
5. You should be redirected to the login page

## Step 5: Customize the Application

### Update Branding

1. Edit the form components in `components/auth/` to match your brand
2. Update colors in the Tailwind classes
3. Add your logo to the auth pages

### Configure Email Templates

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Email Templates**
3. Customize the email templates with your branding
4. Add your logo and company information

### Add Custom Fields

If you need additional user fields:

1. Go to **Table Editor** in Supabase
2. Find the `auth.users` table
3. Add custom fields to `user_metadata` or create a separate `profiles` table
4. Update the signup form to collect additional information

## Step 6: Production Deployment

### Update Environment Variables

For production, update your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Update Supabase URLs

1. Go to **Authentication** > **URL Configuration** in Supabase
2. Update:
   - **Site URL:** `https://yourdomain.com`
   - **Redirect URLs:** Add:
     - `https://yourdomain.com/api/auth/callback`
     - `https://yourdomain.com/reset-password`

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from your `.env.local`
6. Click "Deploy"

## Troubleshooting

### Issue: "Invalid credentials" error

**Solution:**
- Verify email and password are correct
- Check if email confirmation is required
- Look at Supabase Auth logs for details

### Issue: Email not received

**Solution:**
- Check spam folder
- Verify email provider settings in Supabase
- Check Supabase email logs
- For development, use a service like [Mailtrap](https://mailtrap.io)

### Issue: Redirect loop

**Solution:**
- Clear browser cookies
- Check middleware configuration in `middleware.ts`
- Verify Supabase credentials are correct
- Check browser console for errors

### Issue: Session not persisting

**Solution:**
- Ensure cookies are enabled in browser
- Check that `NEXT_PUBLIC_APP_URL` matches your domain
- Verify middleware is configured correctly
- Check browser developer tools > Application > Cookies

## Security Checklist

Before going to production:

- [ ] Environment variables are set correctly
- [ ] `.env.local` is in `.gitignore`
- [ ] Email confirmation is enabled (recommended)
- [ ] Password requirements are enforced
- [ ] HTTPS is enabled in production
- [ ] Secure cookies are enabled (automatic in production)
- [ ] Rate limiting is configured (optional but recommended)
- [ ] CSRF protection is enabled (optional but recommended)
- [ ] Error messages don't reveal sensitive information
- [ ] Audit logging is set up (optional)

## Next Steps

Now that your authentication system is set up, you can:

1. Add OAuth providers (Google, GitHub, etc.)
2. Implement user profiles
3. Add role-based access control
4. Set up email verification flow
5. Add two-factor authentication
6. Implement rate limiting
7. Add audit logging
8. Set up monitoring and alerts

## Support

For detailed technical documentation, refer to:
- `.kiro/specs/authentication-system/requirements.md` - Detailed requirements
- `.kiro/specs/authentication-system/design.md` - System design and architecture
- `.kiro/specs/authentication-system/tasks.md` - Implementation tasks

For Supabase-specific help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
