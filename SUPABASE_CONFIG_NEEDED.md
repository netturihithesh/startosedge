# 🔑 Supabase Configuration

## Instructions

Please provide your Supabase credentials and I'll update the `supabaseClient.js` file for you.

### Required Information:

1. **Supabase Project URL**: 
   - Go to your Supabase Dashboard → Settings → API
   - Copy the "Project URL" (looks like: `https://xxxxxxxxxxxxx.supabase.co`)

2. **Supabase Anon Key**:
   - Same page as above
   - Copy the "anon public" key (long string starting with `eyJ...`)

### Share them in this format:

```
Project URL: https://your-project.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## What I'll Update

Once you provide these, I'll update:
- `src/supabaseClient.js` with your actual credentials

## Security Note

The anon key is **safe to expose** in frontend code - it's designed for client-side use and protected by Row Level Security (RLS) policies in your Supabase database.
