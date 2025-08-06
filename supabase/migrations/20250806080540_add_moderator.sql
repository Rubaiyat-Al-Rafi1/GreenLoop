/*
  # Add Moderator User Type

  1. Updates
    - Modify user_type_enum to include 'moderator' type
    - Add policies for moderator access
*/

-- Alter the user_type_enum to add 'moderator' type
ALTER TYPE user_type_enum ADD VALUE IF NOT EXISTS 'moderator';

-- Create policies for moderators to access all data
CREATE POLICY "Moderators can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'moderator'
    )
  );

CREATE POLICY "Moderators can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'moderator'
    )
  );

CREATE POLICY "Moderators can read all pickups"
  ON pickups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'moderator'
    )
  );

CREATE POLICY "Moderators can update all pickups"
  ON pickups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'moderator'
    )
  );

CREATE POLICY "Moderators can read all recycling activities"
  ON recycling_activities
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'moderator'
    )
  );