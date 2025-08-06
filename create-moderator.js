// Script to create a moderator user in GreenLoop

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

async function createModerator() {
  const email = 'moderator@.gl';
  const password = '1234mdtt';
  const name = 'System Moderator';
  
  console.log('Creating moderator account...');
  
  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Moderator account already exists. Updating to moderator type...');
      
      // Update user type to moderator
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_type: 'moderator' })
        .eq('email', email);
      
      if (updateError) {
        throw updateError;
      }
      
      console.log('Moderator account updated successfully!');
      return;
    }
    
    // Create new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          phone: null,
          user_type: 'moderator',
          points: 0,
        });

      if (profileError) {
        throw profileError;
      }
      
      console.log('Moderator account created successfully!');
      console.log('Email: moderator@gl.com');
      console.log('Password: 1234mdtt');
    }
  } catch (error) {
    console.error('Error creating moderator account:', error.message);
  }
}

createModerator();