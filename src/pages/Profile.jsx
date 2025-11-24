import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { toasts, removeToast, success, error: showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        bio: '',
        college: '',
        degree: '',
        graduationYear: '',
        skills: '',
        role: 'user'
    });
    const [completionPercentage, setCompletionPercentage] = useState(0);

    // Calculate profile completion percentage
    const calculateCompletion = (data) => {
        if (!data) return 0;

        const fields = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            college: data.college,
            degree: data.degree,
            graduationYear: data.graduationYear,
            bio: data.bio,
            linkedin: data.linkedin,
            github: data.github,
            portfolio: data.portfolio,
            skills: data.skills
        };

        const filledFields = Object.values(fields).filter(val => {
            if (!val) return false;
            if (typeof val === 'string') return val.trim().length > 0;
            return true;
        }).length;

        const totalFields = Object.keys(fields).length;
        return Math.round((filledFields / totalFields) * 100);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFormData({
                        name: userData.name || '',
                        email: userData.email || user.email || '',
                        phone: userData.phone || '',
                        linkedin: userData.linkedin || '',
                        github: userData.github || '',
                        portfolio: userData.portfolio || '',
                        bio: userData.bio || '',
                        college: userData.college || '',
                        degree: userData.degree || '',
                        graduationYear: userData.graduationYear || '',
                        skills: userData.skills || '',
                        role: userData.role || 'user'
                    });
                    setCompletionPercentage(calculateCompletion(userData));
                } else {
                    // If no profile exists, set email from user
                    setFormData(prev => ({ ...prev, email: user.email }));
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                showError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            await setDoc(doc(db, 'users', user.uid), {
                ...formData,
                email: user.email // Ensure email is set
            }, { merge: true });

            success('Profile updated successfully!');
            setIsEditing(false);
            setCompletionPercentage(calculateCompletion(formData));
        } catch (error) {
            console.error('Error saving profile:', error);
            showError('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await signOut(auth);
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="container profile-container">
                <div className="profile-header">
                    <div className="header-text">
                        <h1>My Profile</h1>
                        <p className="text-secondary">Manage your personal information and portfolio</p>
                    </div>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                ❌ Cancel
                            </button>
                        )}
                        <button className="btn btn-danger" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                <div className="completion-card card">
                    <div className="completion-header">
                        <div>
                            <h3>Profile Completion</h3>
                            <p>Complete your profile to get better recommendations</p>
                        </div>
                        <div className="completion-percentage">
                            <span className={completionPercentage === 100 ? 'complete' : 'incomplete'}>
                                {completionPercentage}%
                            </span>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-section card">
                        <h2>👤 Personal Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="input-disabled"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section card">
                        <h2>🎓 Education</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>College/University</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="IIT Delhi"
                                />
                            </div>
                            <div className="form-group">
                                <label>Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    value={formData.degree}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="B.Tech in Computer Science"
                                />
                            </div>
                            <div className="form-group">
                                <label>Graduation Year</label>
                                <input
                                    type="text"
                                    name="graduationYear"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="2024"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section card">
                        <h2>🔗 Professional Links</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>
                            <div className="form-group">
                                <label>GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://github.com/yourusername"
                                />
                            </div>
                            <div className="form-group">
                                <label>Portfolio</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section card">
                        <h2>📝 About</h2>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="4"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Skills (comma-separated)</label>
                            <textarea
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="2"
                                placeholder="React, Node.js, Python, MongoDB"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                                {saving ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
