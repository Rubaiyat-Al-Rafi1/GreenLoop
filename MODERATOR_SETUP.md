# GreenLoop Moderator Panel Setup

## Overview

The GreenLoop application now includes a moderator panel that allows authorized users to:

- Manage pickup requests
- Assign pickups to green riders
- Update pickup statuses
- View and manage users
- Monitor recycling centers

## Moderator Account Setup

A default moderator account has been configured with the following credentials:

- **Email**: moderator@gl.com
- **Password**: 1234mdtt

### Creating the Moderator Account

To create the moderator account, you can use one of the following methods:

#### Method 1: Using the Create Moderator Script

1. Make sure your Supabase credentials are set in the `.env` file
2. Run the following command in the project root:

```bash
node create-moderator.js
```

#### Method 2: Manual Registration

1. Register a new account using the GreenLoop sign-up form with the email `moderator@gl.com`
2. After registration, update the user type to 'moderator' in the Supabase database:

```sql
UPDATE profiles
SET user_type = 'moderator'
WHERE email = 'moderator@gl.com';
```

## Accessing the Moderator Panel

1. Log in with the moderator credentials (email: moderator@gl.com, password: 1234mdtt)
2. The application will automatically redirect you to the moderator dashboard

## Moderator Panel Features

### Pickup Requests Management

- View all pickup requests across the system
- Filter requests by status (scheduled, in progress, completed, cancelled)
- Search for specific pickups by customer, center, or description
- Assign pickups to green riders (facility staff)
- Update pickup statuses

### User Management

- View all users in the system
- See user details including type, points, and join date

### Recycling Centers

- View all recycling centers
- Monitor capacity status

### Schedule

- View upcoming pickups (scheduled and in-progress)
- Manage pickup details

## Implementation Details

The moderator functionality has been implemented with the following changes:

1. Added 'moderator' to the user_type enum in the database
2. Created database policies to allow moderators to access all data
3. Implemented ModeratorDashboard component
4. Updated the Dashboard component to render the ModeratorDashboard for moderator users
5. Modified the App.tsx to redirect to dashboard after login

## Security Considerations

- The moderator account has elevated privileges and should be protected with a strong password in production
- Row-level security policies in Supabase restrict data access based on user type
- Only users with the 'moderator' type can access the moderator dashboard