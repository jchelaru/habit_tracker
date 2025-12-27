# Quick Supabase Setup Guide

## 🚀 Quick Steps

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Sign up/Login → Click "New Project"
- Fill in details → Wait 2-3 minutes

### 2. Run SQL Schema
- In Supabase dashboard → Click **"SQL Editor"**
- Click **"New query"**
- Copy **entire contents** of `supabase-schema.sql`
- Paste and click **"Run"**

### 3. Get API Keys
- Settings → **"API"**
- Copy **Project URL** (looks like `https://xxxxx.supabase.co`)
- Copy **anon public** key (long string starting with `eyJ...`)

### 4. Create `.env` File
In your project root, create `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Test It!
```bash
npm run dev
```

Open `http://localhost:5173` → Sign up → Create a habit → Done! ✅

---

📖 **Full detailed instructions**: See `SUPABASE_SETUP.md`

