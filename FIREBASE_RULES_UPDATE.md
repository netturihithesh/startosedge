# 🚨 Fix "Insufficient Permissions" Error

The error you are seeing happens because **Firestore Security Rules** are blocking you from updating another user's profile. By default, you can only edit your *own* data.

To fix this, you need to tell Firebase that **Admins** are allowed to edit **anyone**.

### **Steps to Fix:**

1.  Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2.  Select your project (**emerald-crab** or similar).
3.  Click on **Firestore Database** in the left menu.
4.  Click on the **Rules** tab (at the top).
5.  **Delete everything** there and paste the following code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if the user is an admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      // Allow users to read/write their OWN profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow Admins to read/write ANY profile (Required for "Grant Access")
      allow read, write: if isAdmin();
    }
    
    match /programs/{programId} {
      // Anyone can view programs
      allow read: if true;
      // Only admins can add/edit programs
      allow write: if isAdmin();
    }
  }
}
```

6.  Click **Publish**.

### **Try Again**
Once you publish these rules, go back to your website and try clicking **"Grant Access"** again. It will work! ✅
