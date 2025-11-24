const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register User
exports.register = async (req, res) => {
    const { name, email, password, adminCode } = req.body;
    console.log(`[Register] Attempt for email: ${email}`);

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log(`[Register] User already exists: ${email}`);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine role
        let role = 'user';
        if (adminCode === 'secret123') {
            role = 'admin';
            console.log(`[Register] Admin code accepted for: ${email}`);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        console.log(`[Register] User created successfully: ${user.id}`);

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (error) {
        console.error(`[Register] Error: ${error.message}`);
        res.status(500).send('Server error');
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[Login] Attempt for email: ${email}`);

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log(`[Login] User not found: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[Login] Invalid password for: ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`[Login] Success for: ${email}`);

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (error) {
        console.error(`[Login] Error: ${error.message}`);
        res.status(500).send('Server error');
    }
};

// Google Login (Simulated)
exports.googleLogin = async (req, res) => {
    // In a real app, we would verify the token with Google here.
    // For this demo, we accept any token and use the provided email/name.
    const { email, name, googleId } = req.body;
    console.log(`[Google Login] Attempt for: ${email}`);

    try {
        let user = await User.findOne({ email });

        if (user) {
            console.log(`[Google Login] Existing user found: ${email}`);
            // Update googleId if not present (optional)
        } else {
            console.log(`[Google Login] Creating new user: ${email}`);
            // Create new user
            // Note: Password is required by schema, so we generate a random one
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
                role: 'user', // Default to user for Google login
                // googleId: googleId // If we added this to schema
            });

            await user.save();
        }

        // Create token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );

    } catch (error) {
        console.error(`[Google Login] Error: ${error.message}`);
        res.status(500).send('Server error');
    }
};
