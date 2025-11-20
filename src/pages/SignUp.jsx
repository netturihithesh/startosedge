import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        program: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('Sign up attempt:', formData);
        alert('Registration successful! Welcome to StartosEdge!');
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-card card">
                    <div className="signup-header">
                        <h1>Create Your Account</h1>
                        <p>Join thousands of successful students at StartosEdge</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
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
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="program">Interested Program</label>
                            <select
                                id="program"
                                name="program"
                                value={formData.program}
                                onChange={handleChange}
                            >
                                <option value="">Select a program</option>
                                <option value="fullstack">Full Stack Development</option>
                                <option value="datascience">Data Science & ML</option>
                                <option value="cybersecurity">Cyber Security</option>
                                <option value="digitalmarketing">Digital Marketing</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="terms-checkbox">
                            <label className="checkbox-label">
                                <input type="checkbox" required />
                                <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg">
                            Create Account
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <div className="signup-divider">
                        <span>OR</span>
                    </div>

                    <div className="social-signup">
                        <button className="btn btn-secondary social-btn">
                            <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
