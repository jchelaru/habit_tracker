# Supabase Setup Instructions

Follow these steps to set up Supabase for your Momentum habit tracker app.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"** if you already have an account
3. Sign up or log in with GitHub, Google, or email
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name**: `momentum` (or any name you prefer)
   - **Database Password**: Create a strong password (save this - you'll need it)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Select **Free** (perfect for getting started)
6. Click **"Create new project"**
7. Wait 2-3 minutes for your project to be provisioned

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `supabase-schema.sql` file from this project
4. Copy the **entire contents** of the file
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)
7. You should see a success message: "Success. No rows returned"

This will create:
- `profiles` table (user profiles)
- `habits` table (habit definitions)
- `completions` table (daily completions)
- Row Level Security (RLS) policies
- Triggers for automatic profile creation

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, click on **"Settings"** (gear icon) in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see two important values:

   **Project URL**: 
   - Found under "Project URL"
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`

   **anon/public key**:
   - Found under "Project API keys" → "anon public"
   - This is a long string starting with `eyJ...`

4. **Copy both values** - you'll need them in the next step

## Step 4: Configure Environment Variables

1. In your project root directory (`/Users/juliachelaru/code/momentum`), create a `.env` file:

```bash
# If the file doesn't exist, create it
touch .env
```

2. Open the `.env` file and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace:**
- `https://your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your actual anon/public key

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Important**: Make sure `.env` is in your `.gitignore` file (it should be by default)

## Step 5: Verify the Setup

1. Restart your dev server if it's running:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. Open your app in the browser (usually `http://localhost:5173`)

3. You should see the **Auth** page

4. Try creating an account:
   - Enter an email and password
   - Click "Sign Up"
   - You should be redirected to the Dashboard

5. Check Supabase to verify:
   - Go to **"Table Editor"** in Supabase dashboard
   - You should see a new row in the `profiles` table with your user info

## Step 6: Test Creating a Habit

1. In your app, click **"Add Habit"** or navigate to create a habit
2. Fill in the form:
   - Name: "Morning Meditation"
   - Frequency: "Daily"
   - (Optional) Set a reminder time
3. Click **"Create Habit"**
4. Check Supabase:
   - Go to **"Table Editor"** → `habits` table
   - You should see your new habit

## Troubleshooting

### "Missing Supabase environment variables" warning
- Make sure your `.env` file is in the project root
- Verify the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating/updating `.env`

### "User not authenticated" errors
- Make sure you've signed up/logged in
- Check the browser console for detailed error messages
- Verify RLS policies were created (check SQL Editor history)

### Database connection errors
- Verify your Project URL is correct (no trailing slashes)
- Check that your anon key is the correct one (not the service_role key)
- Ensure your Supabase project is active (not paused)

### RLS (Row Level Security) errors
- Make sure you ran the entire `supabase-schema.sql` file
- Check that RLS policies were created:
  - Go to **"Authentication"** → **"Policies"** in Supabase
  - You should see policies for `profiles`, `habits`, and `completions` tables

## Next Steps

Once everything is working:
1. ✅ Create your first habit
2. ✅ Mark it as complete for today
3. ✅ Check the `completions` table in Supabase to see the record
4. ✅ Explore the Analytics page to see the heatmap

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Never commit your `.env` file to git
- RLS policies ensure users can only access their own data
- The `service_role` key should NEVER be used in client-side code

## Need Help?

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- Check the browser console for detailed error messages

