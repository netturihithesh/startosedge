import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleResize = () => {
            // Close mobile menu when window is resized above mobile breakpoint
            if (window.innerWidth > 968) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLinkClick = () => {
        // Close mobile menu when a link is clicked
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <Link to="/" className="logo-text" onClick={handleLinkClick}>StartosEdge</Link>
                    </div>

                    <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <Link to="/" className="nav-link" onClick={handleLinkClick}>Home</Link>
                        <Link to="/programs" className="nav-link" onClick={handleLinkClick}>Programs</Link>
                        <Link to="/internships" className="nav-link" onClick={handleLinkClick}>Internships</Link>
                        <Link to="/collaborate" className="nav-link" onClick={handleLinkClick}>Collaborate</Link>
                        <Link to="/about" className="nav-link" onClick={handleLinkClick}>About Us</Link>
                    </div>

                    <div className="navbar-actions">
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/signup" className="btn btn-primary">Get Started</Link>
                    </div>

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
