# 🔥 Firebase Setup Guide for StartosEdge

This guide contains the exact configuration needed for your project.
**Goal:** Secure user data & keep everything on the **Free (Spark) Plan**.

---

## 1️⃣ Firestore Security Rules (Crucial)

**Action:** Go to **Firebase Console** → **Firestore Database** → **Rules** tab.
**Paste this code:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================================
    // 👤 USERS COLLECTION (Profile Data)
    // ============================================================
    match /users/{userId} {
      // 1. READ: Users can read ONLY their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // 2. WRITE: Users can create/update ONLY their own profile
      // We validate that they are not making themselves an 'admin'
      allow create, update: if request.auth != null && 
                               request.auth.uid == userId &&
                               (!request.resource.data.keys().hasAny(['role']) || request.resource.data.role == 'user');
      
      // 3. DELETE: Users cannot delete their profile (safety)
      allow delete: if false;
    }
    
    // ADMIN ACCESS: Admins can read ALL users
    match /users/{userId} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ============================================================
    // 🎓 PROGRAMS COLLECTION (Courses/Internships)
    // ============================================================
    match /programs/{programId} {
      // Everyone (even guests) can view programs
      allow read: if true;
      
      // Only Admins can create/edit programs
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ============================================================
    // 📝 CONTACT FORM SUBMISSIONS
    // ============================================================
    match /contacts/{contactId} {
      // Anyone can submit a contact form
      allow create: if true;
      
      // Only Admins can read submissions
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 2️⃣ Authentication Settings

**Action:** Go to **Authentication** → **Sign-in method**.
1. Enable **Email/Password**.
2. Enable **Google**.
3. **IMPORTANT:** Go to **Settings** (in Auth) → **Authorized domains**.
   - Ensure `localhost` is listed.
   - Add your production domain (e.g., `startosedge.web.app`) when you deploy.

---

## 3️⃣ Free Tier (Spark Plan) Limits

Your project is optimized to stay within free limits:
- **Stored Data:** 1 GiB total (plenty for text profiles).
- **Writes:** 20,000 per day (approx 20,000 profile updates/day).
- **Reads:** 50,000 per day.

**Tip:** The current code only reads the profile **once** per login/refresh, so you are very safe from hitting limits.

---

## 4️⃣ Indexes (Optional)

If you see an error saying "The query requires an index", click the link in the error console to create it automatically. You likely won't need any for the basic profile flow.
