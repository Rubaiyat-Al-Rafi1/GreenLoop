// Script to test the moderator login in GreenLoop

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testModeratorLogin() {
  const email = 'moderator@gl.com';
  const password = '1234mdtt';
  
  console.log('Testing moderator login...');
  
  try {
    // Try to sign in with moderator credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login failed:', error.message);
      console.log('\nThe moderator account may not exist yet. Please create it first:');
      console.log('1. Run "node create-moderator.js"');
      console.log('2. Or register manually and update the user_type to "moderator" in the database');
      return;
    }

    if (data.user) {
      console.log('Login successful!');
      console.log('User ID:', data.user.id);
      
      // Fetch profile to verify user type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
        return;
      }
      
      console.log('User type:', profile.user_type);
      
      if (profile.user_type !== 'moderator') {
        console.warn('Warning: User exists but is not a moderator type!');
        console.log('Please update the user type to "moderator" in the database:');
        console.log(`UPDATE profiles SET user_type = 'moderator' WHERE id = '${data.user.id}';`);
      } else {
        console.log('Moderator account is properly configured!');
        console.log('\nYou can now log in to the application with:');
        console.log('Email: moderator@gl.com');
        console.log('Password: 1234mdtt');
      }
    }
  } catch (error) {
    console.error('Error testing moderator login:', error.message);
  } finally {
    // Sign out
    await supabase.auth.signOut();
  }
}

testModeratorLogin();