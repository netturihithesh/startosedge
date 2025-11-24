# 🚀 StartosEdge - Complete Supabase Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase SQL Setup](#supabase-sql-setup)
3. [Storage Bucket Setup](#storage-bucket-setup)
4. [Firebase Admin Setup](#firebase-admin-setup)
5. [Testing Checklist](#testing-checklist)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, make sure you have:
- ✅ Supabase account created
- ✅ Project created: `dpcisqeugzvbqfmcrhzw`
- ✅ Firebase project with Authentication enabled
- ✅ Google OAuth enabled in Firebase Console

---

## 🗄️ Supabase SQL Setup

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard/project/dpcisqeugzvbqfmcrhzw
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Paste and Run This Complete SQL Script

```sql
-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- For StartosEdge Platform
-- ============================================

-- Clean up existing tables (if any)
DROP TABLE IF EXISTS program_videos CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- 1. Programs Table (Courses)
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  price TEXT,
  category TEXT DEFAULT 'technical',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Program Videos Table
CREATE TABLE program_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Internships Table
CREATE TABLE internships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  type TEXT,
  stipend TEXT,
  duration TEXT,
  apply_link TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  coins INTEGER DEFAULT 0,
  difficulty TEXT,
  skills_required TEXT,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISABLE RLS (since using Firebase Auth)
-- ============================================
ALTER TABLE programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE program_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- ============================================
-- GRANT PUBLIC ACCESS
-- ============================================
GRANT ALL ON programs TO anon, authenticated;
GRANT ALL ON program_videos TO anon, authenticated;
GRANT ALL ON internships TO anon, authenticated;
GRANT ALL ON tasks TO anon, authenticated;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_program_videos_program_id ON program_videos(program_id);
CREATE INDEX idx_programs_category ON programs(category);
CREATE INDEX idx_tasks_difficulty ON tasks(difficulty);

-- ============================================
-- SUCCESS!
-- ============================================
-- Your database is now ready!
```

### Step 3: Verify Tables Created
After running the SQL:
1. Click **Table Editor** in left sidebar
2. You should see 4 tables:
   - ✅ `programs`
   - ✅ `program_videos`
   - ✅ `internships`
   - ✅ `tasks`

---

## 📦 Storage Bucket Setup

### Step 1: Create Storage Bucket (Already Done ✅)
You've already created `course-videos` bucket.

### Step 2: Set Bucket to Public
1. Go to **Storage** in left sidebar
2. Click on `course-videos` bucket
3. Click **Configuration** tab
4. Toggle **Public bucket** to **ON**

### Step 3: Set Storage Policies

Go back to **SQL Editor** and run:

```sql
-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

-- Allow public upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-videos');

-- Allow public delete
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-videos');
```

---

## 🔥 Firebase Admin Setup

### Step 1: Sign Up on Your Website
1. Go to http://localhost:5173/signup
2. Create an account with your email
3. Complete the signup

### Step 2: Make Yourself Admin
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **startosedge-1bcd3**
3. Click **Firestore Database** in left sidebar
4. Find the `users` collection
5. Click on your user document
6. Edit the document
7. Find the `role` field
8. Change value from `"user"` to `"admin"`
9. Click **Update**

### Step 3: Refresh Your Website
1. Go back to http://localhost:5173/programs
2. Refresh the page (F5)
3. You should now see **"👑 Admin: Add New Program"**

---

## ✅ Testing Checklist

### 1. Test Authentication
- [ ] Sign up creates user in Firebase
- [ ] Login works with email/password
- [ ] Google OAuth login works
- [ ] Logout works
- [ ] Profile page loads

### 2. Test Admin Access
- [ ] Admin panel visible on `/programs`
- [ ] Can see admin panel on course viewer
- [ ] Can see admin panel on internships
- [ ] Can see admin panel on tasks

### 3. Test Program Management
- [ ] Can add new program
- [ ] Thumbnail upload works
- [ ] Program appears in list
- [ ] Can click program to view
- [ ] Can delete program

### 4. Test Video Management
- [ ] Can add YouTube video to program
- [ ] Video appears in sidebar
- [ ] Can play video
- [ ] Can delete video

### 5. Test Internships
- [ ] Can add internship
- [ ] Internship appears in list
- [ ] Can delete internship

### 6. Test Tasks
- [ ] Can add task
- [ ] Task appears in list
- [ ] Can delete task

---

## 🐛 Troubleshooting

### "Failed to add program"
**Solution:** Make sure you ran the complete SQL script in Supabase SQL Editor.

### "Not authorized" errors
**Solution:** 
1. Check that RLS is disabled: `ALTER TABLE programs DISABLE ROW LEVEL SECURITY;`
2. Check grants: `GRANT ALL ON programs TO anon, authenticated;`

### Admin panel not showing
**Solution:**
1. Verify you're logged in
2. Check Firebase Firestore that your user has `role: "admin"`
3. Refresh the page

### Thumbnail upload fails
**Solution:**
1. Make sure `course-videos` bucket is **public**
2. Check storage policies are set correctly
3. File size must be < 2MB
4. File must be an image

### Videos not playing
**Solution:**
1. Use valid YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Check video is not private/restricted

### Page is blank
**Solution:**
1. Check browser console for errors (F12)
2. Make sure Firebase config is correct in `src/firebase.js`
3. Make sure Supabase config is correct in `src/supabaseClient.js`

---

## 🎯 Quick Start Commands

### After Supabase Setup:
1. **Make yourself admin** in Firebase Console
2. **Refresh website**
3. **Add a test program:**
   - Title: "Full Stack Development"
   - Price: "₹20,000"
   - Duration: "6 Months"
   - Category: "Technical"
   - Upload a thumbnail image
   - Description: "Learn MERN stack"
4. **Click the program**
5. **Add a test video:**
   - Title: "Introduction to React"
   - Description: "Learn React basics"
   - Video URL: `https://www.youtube.com/watch?v=SqcY0GlETPk`

---

## 📊 Database Schema Summary

```
programs
├── id (UUID, PRIMARY KEY)
├── title (TEXT)
├── description (TEXT)
├── duration (TEXT)
├── price (TEXT)
├── category (TEXT)
├── thumbnail_url (TEXT)
└── created_at (TIMESTAMPTZ)

program_videos
├── id (UUID, PRIMARY KEY)
├── program_id (UUID, FOREIGN KEY → programs.id)
├── title (TEXT)
├── description (TEXT)
├── video_url (TEXT)
└── created_at (TIMESTAMPTZ)

internships
├── id (UUID, PRIMARY KEY)
├── title (TEXT)
├── company (TEXT)
├── location (TEXT)
├── type (TEXT)
├── stipend (TEXT)
├── duration (TEXT)
├── apply_link (TEXT)
├── description (TEXT)
└── created_at (TIMESTAMPTZ)

tasks
├── id (UUID, PRIMARY KEY)
├── title (TEXT)
├── description (TEXT)
├── coins (INTEGER)
├── difficulty (TEXT)
├── skills_required (TEXT)
├── deadline (DATE)
└── created_at (TIMESTAMPTZ)
```

---

## 🔐 Security Notes

1. **RLS is DISABLED** - This is intentional since you're using Firebase Auth
2. **Public bucket** - This is necessary for image uploads to work
3. **Admin role** - Managed in Firebase Firestore, not Supabase
4. **Anon key** - Safe to expose in frontend code

---

## 🚀 You're All Set!

After completing this setup:
1. ✅ Supabase database ready
2. ✅ Storage bucket configured
3. ✅ Firebase admin role set
4. ✅ Ready to add programs and videos

**Need help?** Check the troubleshooting section above!
