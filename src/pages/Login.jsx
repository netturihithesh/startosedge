import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { checkProfileCompleteness } from '../utils/profileUtils';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

            if (!userCredential.user.emailVerified) {
                await auth.signOut();
                showError('Please verify your email address before logging in. Check your inbox.');
                setLoading(false);
                return;
            }

            // Check profile completeness
            const { isComplete } = await checkProfileCompleteness(userCredential.user.uid);

            success('Login successful!');
            setTimeout(() => {
                if (!isComplete) {
                    navigate('/profile');
                } else {
                    navigate('/');
                }
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            let errorMessage = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
            if (error.code === 'auth/wrong-password') errorMessage = 'Incorrect password.';
            if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address.';
            showError(errorMessage);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user exists in Firestore, if not create entry
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    role: 'user',
                    createdAt: new Date()
                });
            }

            // Check profile completeness
            const { isComplete } = await checkProfileCompleteness(user.uid);

            success('Google login successful!');
            setTimeout(() => {
                if (!isComplete) {
                    navigate('/profile');
                } else {
                    navigate('/');
                }
            }, 1500);
        } catch (error) {
            console.error('Google login error:', error);
            showError('Google login failed.');
        }
    };

    const handleForgotPassword = async (email) => {
        if (!email || !email.trim()) {
            showError('Please enter your email address.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            success(`Password reset email sent to ${email}.`);
            setShowForgotPasswordModal(false);
        } catch (error) {
            console.error('Password reset error:', error);
            showError('Could not send password reset email.');
        }
    };

    return (
        <div className="login-page">
            {/* Toast Notifications */}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <Modal
                    title="Reset Password"
                    message="Enter your email address to receive a password reset link."
                    onConfirm={handleForgotPassword}
                    onCancel={() => setShowForgotPasswordModal(false)}
                    confirmText="Send Reset Link"
                    inputType="email"
                />
            )}

            <div className="login-container">
                <div className="login-left">
                    <div className="login-header">
                        <h1>Welcome to <span className="text-gradient">StartosEdge</span></h1>
                        <p>Log in to continue your journey to your dream career.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPasswordModal(true); }} className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button type="button" className="btn btn-google btn-full" onClick={handleGoogleLogin}>
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                            Sign in with Google
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-benefits">
                        <h3>Why Choose StartosEdge?</h3>
                        <ul>
                            <li>🚀 <strong>100% Placement Assistance</strong> with top MNCs</li>
                            <li>👨‍🏫 <strong>Expert Mentorship</strong> from industry leaders</li>
                            <li>💼 <strong>Real-world Projects</strong> to build your portfolio</li>
                            <li>🌐 <strong>Global Community</strong> of tech enthusiasts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
