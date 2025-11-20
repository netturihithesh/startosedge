import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        alert('Login functionality will be implemented with backend!');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card card">
                    <div className="login-header">
                        <h1>Welcome Back!</h1>
                        <p>Sign in to continue your learning journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg">
                            Sign In
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <div className="login-divider">
                        <span>OR</span>
                    </div>

                    <div className="social-login">
                        <button className="btn btn-secondary social-btn">
                            <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
                    </div>
                </div>

                <div className="login-benefits">
                    <h2>Why Choose <span className="text-gradient">StartosEdge?</span></h2>
                    <ul className="benefits-list">
                        <li>
                            <span className="benefit-icon">🎓</span>
                            <div>
                                <h4>Expert-Led Training</h4>
                                <p>Learn from industry professionals</p>
                            </div>
                        </li>
                        <li>
                            <span className="benefit-icon">💼</span>
                            <div>
                                <h4>100% Placement Support</h4>
                                <p>Guaranteed interview opportunities</p>
                            </div>
                        </li>
                        <li>
                            <span className="benefit-icon">🚀</span>
                            <div>
                                <h4>Real-World Projects</h4>
                                <p>Build your portfolio with live projects</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
