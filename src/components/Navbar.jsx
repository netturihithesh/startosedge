import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.emailVerified) {
                try {
                    // Fetch user data from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            name: userData.name || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email
                        });
                    } else {
                        setUser({
                            name: firebaseUser.email.split('@')[0],
                            email: firebaseUser.email
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser({
                        name: firebaseUser.email.split('@')[0],
                        email: firebaseUser.email
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleResize = () => {
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
                        <Link to="/taskhub" className="nav-link" onClick={handleLinkClick}>TaskHub</Link>
                        <Link to="/collaborate" className="nav-link" onClick={handleLinkClick}>Collaborate</Link>
                        <Link to="/about" className="nav-link" onClick={handleLinkClick}>About Us</Link>

                        {/* Mobile-only user menu */}
                        <div className="mobile-user-section">
                            {user ? (
                                <>
                                    <div className="mobile-user-info">
                                        <Link to="/profile" onClick={handleLinkClick} style={{ textDecoration: 'none' }}>
                                            <div className="profile-avatar-small">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </Link>
                                        <span className="mobile-user-name">{user.name}</span>
                                    </div>
                                    <button onClick={() => { handleLogout(); handleLinkClick(); }} className="nav-link mobile-nav-btn">
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link mobile-nav-btn" onClick={handleLinkClick}>
                                        🔐 Login
                                    </Link>
                                    <Link to="/signup" className="nav-link mobile-nav-btn" onClick={handleLinkClick}>
                                        ✨ Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="navbar-actions">
                        {user ? (
                            <div className="user-menu">
                                <Link to="/profile" className="profile-avatar-link" title="View Profile">
                                    <div className="profile-avatar-small">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                                <span className="user-name">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
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
