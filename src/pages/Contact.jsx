import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        program: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', phone: '', program: '', message: '' });
    };

    const contactInfo = [
        {
            icon: '📧',
            title: 'Email',
            details: 'info@startosedge.com',
            link: 'mailto:info@startosedge.com'
        },
        {
            icon: '📞',
            title: 'Phone',
            details: '+91 98765 43210',
            link: 'tel:+919876543210'
        },
        {
            icon: '📍',
            title: 'Address',
            details: 'Bangalore, Karnataka, India',
            link: '#'
        },
        {
            icon: '⏰',
            title: 'Working Hours',
            details: 'Mon-Sat: 9:00 AM - 7:00 PM',
            link: '#'
        }
    ];

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero section">
                <div className="container">
                    <div className="contact-hero-content text-center">
                        <h1 className="fade-in-up">Get In <span className="text-gradient">Touch</span></h1>
                        <p className="hero-description fade-in-up">
                            Have questions? We'd love to hear from you. Send us a message and
                            we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact-info-section section">
                <div className="container">
                    <div className="contact-info-grid">
                        {contactInfo.map((info, index) => (
                            <a href={info.link} className="contact-info-card card" key={index}>
                                <div className="contact-icon">{info.icon}</div>
                                <h4>{info.title}</h4>
                                <p>{info.details}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="contact-form-section section">
                <div className="container">
                    <div className="contact-layout">
                        <div className="contact-form-container">
                            <h2>Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
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
                                        required
                                        placeholder="Enter your phone number"
                                    />
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

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Tell us more about your requirements..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary btn-lg">
                                    Send Message
                                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <div className="contact-sidebar">
                            <div className="sidebar-card card">
                                <h3>Why Choose StartosEdge?</h3>
                                <ul className="benefits-list">
                                    <li>✅ 100% Placement Assistance</li>
                                    <li>✅ Industry Expert Trainers</li>
                                    <li>✅ Hands-on Live Projects</li>
                                    <li>✅ Flexible Learning Options</li>
                                    <li>✅ Lifetime Course Access</li>
                                    <li>✅ 24/7 Student Support</li>
                                </ul>
                            </div>

                            <div className="sidebar-card card">
                                <h3>Quick Links</h3>
                                <div className="quick-links">
                                    <a href="/about">About Us</a>
                                    <a href="/programs">Our Programs</a>
                                    <a href="#">Student Success Stories</a>
                                    <a href="#">FAQs</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
