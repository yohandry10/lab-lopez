#!/usr/bin/env ts-node

const { createClient } = require("@supabase/supabase-js");
const readline = require("readline");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // Fallback to .env
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("⛔ Error: Missing required environment variables.");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in your .env.local file.");
  process.exit(1);
}

// Create admin client with service role key
const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Default admin user details
const DEFAULT_ADMIN_EMAIL = "cliente@miempresa.com";
const DEFAULT_ADMIN_PASSWORD = "Administrador123!";
const DEFAULT_ADMIN_FIRSTNAME = "Admin";
const DEFAULT_ADMIN_LASTNAME = "Usuario";
const DEFAULT_ADMIN_USERNAME = "adminuser";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt function with types
function prompt(question: string, defaultValue?: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(`${question}${defaultValue ? ` (default: ${defaultValue})` : ''}: `, (answer: string) => {
      resolve(answer || defaultValue || '');
    });
  });
}

// Create admin user
async function createAdminUser() {
  try {
    console.log("🔐 Creating Admin User in Supabase");
    console.log("=============================================");
    console.log("⚠️  IMPORTANT: This script uses the SUPABASE_SERVICE_KEY which has");
    console.log("   full access to your database. Never expose this key in your frontend code.");
    console.log("   After creating an admin user, consider deleting or securing this script.");
    console.log("=============================================\n");

    // Get admin user details
    const email = await prompt("Admin email", DEFAULT_ADMIN_EMAIL);
    const password = await prompt("Admin password", DEFAULT_ADMIN_PASSWORD);
    const firstName = await prompt("Admin first name", DEFAULT_ADMIN_FIRSTNAME);
    const lastName = await prompt("Admin last name", DEFAULT_ADMIN_LASTNAME);
    const username = await prompt("Admin username", DEFAULT_ADMIN_USERNAME);

    // First check if user already exists
    const { data: usersList, error: listError } = await adminClient.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Error listing users: ${listError.message}`);
    }
    
    const existingUser = usersList.users.find((user: any) => user.email === email);

    if (existingUser) {
      console.log(`\n⚠️ User with email ${email} already exists in Supabase Auth.`);
      
      const confirmUpdate = await prompt("Do you want to update this user to admin? (y/n)", "n");
      if (confirmUpdate.toLowerCase() !== 'y') {
        console.log("\n❌ Operation cancelled.");
        rl.close();
        return;
      }

      // Check if user exists in users table
      const { data: existingUserProfile } = await adminClient
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUserProfile) {
        // Update user type to admin
        const { error: updateError } = await adminClient
          .from("users")
          .update({ 
            user_type: "admin",
            first_name: firstName,
            last_name: lastName,
            username: username,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingUserProfile.id);

        if (updateError) {
          throw new Error(`Error updating user: ${updateError.message}`);
        }

        console.log("\n✅ Existing user successfully updated to admin!");
      } else {
        // User exists in Auth but not in users table, create profile
        const { error: profileError } = await adminClient
          .from("users")
          .insert({
            id: existingUser.id,
            email: email,
            username: username,
            first_name: firstName,
            last_name: lastName,
            user_type: "admin",
            accepted_terms: true,
            accepted_marketing: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          throw new Error(`Error creating user profile: ${profileError.message}`);
        }

        console.log("\n✅ Admin profile created for existing user!");
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (createError || !newUser) {
        throw new Error(`Error creating user: ${createError?.message}`);
      }

      console.log(`\n✅ User created in Supabase Auth with ID: ${newUser.user.id}`);

      // Create user profile in the users table
      const { error: profileError } = await adminClient
        .from("users")
        .insert({
          id: newUser.user.id,
          email: email,
          username: username,
          first_name: firstName,
          last_name: lastName,
          user_type: "admin",
          accepted_terms: true,
          accepted_marketing: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw new Error(`Error creating user profile: ${profileError.message}`);
      }

      console.log("\n✅ Admin user created successfully!");
      console.log(`\n📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`🧑 Name: ${firstName} ${lastName}`);
      console.log(`👤 Username: ${username}`);
      console.log(`🔰 User type: admin`);
    }

    console.log("\n⚠️  SECURITY REMINDER: For security reasons, consider deleting this script");
    console.log("   or restricting access to it after you've created your admin user.");
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : String(error));
  } finally {
    rl.close();
  }
}

// Run the function
createAdminUser(); 