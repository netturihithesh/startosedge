import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import './SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showError("Passwords don't match!");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Send verification email
            await sendEmailVerification(userCredential.user);

            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: formData.fullName,
                email: formData.email,
                role: 'user',
                createdAt: new Date()
            });

            success('Account created! Verification email sent. Please check your inbox.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Signup error:', error);
            setLoading(false);
            let errorMessage = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already in use.';
            if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak.';
            showError(errorMessage);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Create user document in Firestore if doesn't exist
            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                role: 'user',
                createdAt: new Date()
            }, { merge: true });

            success('Account created successfully!');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (error) {
            console.error('Google signup error:', error);
            showError('Google signup failed.');
        }
    };

    return (
        <div className="signup-page">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="signup-container">
                <div className="signup-left">
                    <div className="signup-header">
                        <h1>Create Account</h1>
                        <p>Join StartosEdge and kickstart your career.</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button type="button" className="btn btn-google btn-full" onClick={handleGoogleSignUp}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                            Sign up with Google
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login">Log In</Link></p>
                    </div>
                </div>

                <div className="signup-right">
                    <div className="signup-benefits">
                        <h3>Join the Community</h3>
                        <p>Get access to exclusive resources, mentorship, and job opportunities.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
