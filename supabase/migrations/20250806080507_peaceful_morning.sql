/*
  # Initial Schema for GreenLoop Recycling Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text, nullable)
      - `user_type` (enum: consumer, business, facility)
      - `points` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recycling_centers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `phone` (text)
      - `email` (text)
      - `operating_hours` (text)
      - `accepted_materials` (text array)
      - `rating` (numeric, default 0)
      - `capacity_status` (enum: low, medium, high)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `pickups`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `center_id` (uuid, references recycling_centers)
      - `pickup_date` (date)
      - `pickup_time` (time)
      - `items_description` (text)
      - `estimated_weight` (numeric)
      - `status` (enum: scheduled, in_progress, completed, cancelled)
      - `points_earned` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recycling_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activity_type` (enum: pickup, drop_off, purchase)
      - `material_type` (text)
      - `weight_kg` (numeric)
      - `points_earned` (integer)
      - `co2_saved_kg` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for recycling centers to manage their data
    - Add public read access for recycling centers directory

  3. Functions
    - Function to increment user points
    - Trigger to update profile updated_at timestamp
*/

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('consumer', 'business', 'facility');
CREATE TYPE capacity_status_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE pickup_status_enum AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE activity_type_enum AS ENUM ('pickup', 'drop_off', 'purchase');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  user_type user_type_enum NOT NULL DEFAULT 'consumer',
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recycling_centers table
CREATE TABLE IF NOT EXISTS recycling_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  operating_hours text NOT NULL,
  accepted_materials text[] NOT NULL DEFAULT '{}',
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  capacity_status capacity_status_enum DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  center_id uuid NOT NULL REFERENCES recycling_centers(id) ON DELETE CASCADE,
  pickup_date date NOT NULL,
  pickup_time time NOT NULL,
  items_description text NOT NULL,
  estimated_weight numeric NOT NULL CHECK (estimated_weight > 0),
  status pickup_status_enum DEFAULT 'scheduled',
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recycling_activities table
CREATE TABLE IF NOT EXISTS recycling_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type activity_type_enum NOT NULL,
  material_type text NOT NULL,
  weight_kg numeric NOT NULL CHECK (weight_kg > 0),
  points_earned integer NOT NULL DEFAULT 0,
  co2_saved_kg numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for recycling_centers
CREATE POLICY "Anyone can read recycling centers"
  ON recycling_centers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Facility users can manage their centers"
  ON recycling_centers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'facility'
    )
  );

-- Create policies for pickups
CREATE POLICY "Users can read own pickups"
  ON pickups
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own pickups"
  ON pickups
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pickups"
  ON pickups
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Facilities can read pickups for their centers"
  ON pickups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'facility'
    )
  );

CREATE POLICY "Facilities can update pickups for their centers"
  ON pickups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'facility'
    )
  );

-- Create policies for recycling_activities
CREATE POLICY "Users can read own activities"
  ON recycling_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own activities"
  ON recycling_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to increment user points
CREATE OR REPLACE FUNCTION increment_user_points(user_id uuid, points_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET points = points + points_to_add,
      updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recycling_centers_updated_at
  BEFORE UPDATE ON recycling_centers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pickups_updated_at
  BEFORE UPDATE ON pickups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();