const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// Initialize Firebase Admin SDK
// ⚠️ IMPORTANT: You must set up your service account credentials
// Option 1: Use environment variable GOOGLE_APPLICATION_CREDENTIALS pointing to the JSON file
// Option 2: Manually require the JSON file (not recommended for public repos)
try {
    // Check if we have credentials in env or if we are in a cloud environment that provides them
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log('Firebase Admin initialized with default credentials');
    } else {
        console.warn('⚠️ Firebase Admin NOT initialized. Missing credentials. User deletion from Auth will fail.');
        // You can uncomment this if you put the service-account.json in the server folder
        const serviceAccount = require('./service-account.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('TaskHub API is running');
});

// Delete User Endpoint
app.delete('/api/users/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        // 1. Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);
        console.log(`Successfully deleted user ${uid} from Firebase Auth`);

        // 2. (Optional) You can also delete from Firestore here if you want the server to handle everything
        // await admin.firestore().collection('users').doc(uid).delete();

        res.status(200).json({ message: 'User deleted successfully from Auth' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user from Auth', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
