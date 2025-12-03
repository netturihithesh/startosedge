# 🔐 Server Setup for Secure User Deletion

## Why is this needed?
Deleting a user from the frontend (React) **ONLY** removes their data from the database. It **DOES NOT** remove their login credentials (email/password) from Firebase Authentication.

To fix "Email already in use" errors, you must run this backend server which has the power to delete users from Authentication.

## 🚀 Setup Instructions

### 1. Get Admin Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project.
3. Go to **Project Settings** (gear icon) -> **Service accounts**.
4. Click **Generate new private key**.
5. A JSON file will download.
6. **Rename** this file to `service-account.json`.
7. **Move** this file into the `server/` folder of this project.

### 2. Configure Server
1. Open `server/index.js`.
2. Uncomment the lines that load the service account:
   ```javascript
   // const serviceAccount = require('./service-account.json');
   // admin.initializeApp({
   //     credential: admin.credential.cert(serviceAccount)
   // });
   ```

### 3. Run the Server
Open a **new terminal** and run:
```bash
cd server
npm install
npm start
```

You should see: `Server running on port 5000` and `Firebase Admin initialized`.

### 4. Test It
Go to your Admin Dashboard and delete a user. You should see a success message saying "User deleted from Database and Auth".
