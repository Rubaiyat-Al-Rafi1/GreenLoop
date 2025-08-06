/*
  # Add Moderator User

  This script adds a moderator user with the following credentials:
  - Email: moderator@gl.com
  - Password: 1234mdtt (this will be handled through the application)
*/

-- Note: In a real application, the user would be created through the authentication system
-- and the password would be securely hashed. This is just for development purposes.

-- First, check if the user already exists to avoid duplicates
DO $$
DECLARE
  moderator_exists BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'moderator@gl.com') INTO moderator_exists;
  
  IF NOT moderator_exists THEN
    -- Insert a placeholder for the auth user (in real app, this would be done through auth.sign_up)
    -- The actual user creation should be done through the application's signup process
    RAISE NOTICE 'Moderator user does not exist. Please create it through the application with email moderator@gl.com and password 1234mdtt';
  ELSE
    RAISE NOTICE 'Moderator user already exists';
  END IF;
  
  -- Check if profile exists
  SELECT EXISTS (SELECT 1 FROM profiles WHERE email = 'moderator@gl.com') INTO moderator_exists;
  
  IF NOT moderator_exists THEN
    RAISE NOTICE 'Moderator profile does not exist. Please create it through the application';
  ELSE
    -- Update the user type to moderator if the profile exists
    UPDATE profiles
    SET user_type = 'moderator'
    WHERE email = 'moderator@gl.com';
    
    RAISE NOTICE 'Updated existing profile to moderator type';
  END IF;
END
$$;