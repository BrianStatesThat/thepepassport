# Admin Authentication Setup

This guide explains how to set up authentication for the admin dashboard.

## Overview

The admin dashboard (`/admin`) is now protected with Supabase authentication. Only authenticated users can access the admin functionality.

## Setting Up Admin Users

### 1. Create Admin User in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication > Users**
3. Click **Add user**
4. Enter the admin email and password
5. Click **Create user**

### 2. Set Admin Role (Optional)

If you want to use role-based access control, you can set a custom claim for admin users:

1. In the Supabase Dashboard, go to **Authentication > Users**
2. Click on the admin user
3. In the **User Metadata** section, add:
   ```json
   {
     "role": "admin"
   }
   ```

### 3. Database Policies

The current database policies in `LISTING_SUBMISSIONS_SCHEMA.sql` already include admin role checks. Make sure these are applied to your database.

## How It Works

- **Middleware Protection**: The `middleware.ts` file protects all routes starting with `/admin`
- **Automatic Redirects**:
  - Unauthenticated users accessing `/admin` are redirected to `/admin/login`
  - Authenticated users accessing `/admin/login` are redirected to `/admin`
- **Session Management**: Uses Supabase's built-in session management with secure cookies

## Testing

1. Try accessing `/admin` without being logged in - you should be redirected to `/admin/login`
2. Log in with admin credentials - you should be redirected to `/admin`
3. Access admin functionality - approve/reject submissions
4. Log out - you should be redirected back to login

## Security Notes

- Passwords are hashed and stored securely by Supabase
- Sessions are managed with HTTP-only cookies
- All admin actions require authentication
- Database policies ensure only admins can view/manage submissions

## Troubleshooting

### User can't log in
- Check that the user exists in Supabase Authentication > Users
- Verify the email and password are correct
- Check browser console for any errors

### Still getting redirected to login
- Clear browser cookies and try again
- Check that middleware is running (check server logs)
- Verify Supabase URL and keys are correct in environment variables

### Database access issues
- Ensure RLS policies are applied to the `listing_submissions` table
- Check that the user has the correct role in their JWT token