import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { supabase } from '../supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import './AdminUsers.css';

const AdminUsers = () => {
    const navigate = useNavigate();
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { toasts, success, error: showError, removeToast } = useToast();

    const [users, setUsers] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        role: '',
        enrolled_programs: []
    });
    const [currentUserRole, setCurrentUserRole] = useState('user');

    useEffect(() => {
        if (!adminLoading && !isAdmin) {
            showError('Access denied. Admin privileges required.');
            navigate('/');
        }
    }, [isAdmin, adminLoading, navigate]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchPrograms();
            fetchCurrentUserRole();
        }
    }, [isAdmin]);

    const fetchCurrentUserRole = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setCurrentUserRole(userDoc.data().role || 'user');
            }
        } catch (error) {
            console.error('Error fetching current user role:', error);
        }
    };

    const fetchPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('programs')
                .select('id, title');

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error);
            showError('Failed to fetch programs list.');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date(),
                enrolled_programs: doc.data().enrolled_programs || []
            }));

            // Sort by created date, newest first
            usersList.sort((a, b) => b.createdAt - a.createdAt);
            setUsers(usersList);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            // Prevent deleting yourself
            if (selectedUser.id === auth.currentUser?.uid) {
                showError('You cannot delete your own account from here.');
                setShowDeleteModal(false);
                return;
            }

            await deleteDoc(doc(db, 'users', selectedUser.id));
            success(`User ${selectedUser.name || selectedUser.email} has been deleted.`);
            setShowDeleteModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            showError('Failed to delete user.');
        }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;

        // Only super admin can change roles
        if (editFormData.role !== selectedUser.role && currentUserRole !== 'super_admin') {
            showError('Only Super Admins can change user roles.');
            return;
        }

        try {
            const userRef = doc(db, 'users', selectedUser.id);
            await updateDoc(userRef, {
                role: editFormData.role,
                enrolled_programs: editFormData.enrolled_programs,
                // Maintain backward compatibility if needed, or just rely on enrolled_programs
                hasAccess: editFormData.enrolled_programs.length > 0
            });
            success(`User ${selectedUser.name || selectedUser.email} has been updated.`);
            setShowEditModal(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            showError('Failed to update user.');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditFormData({
            role: user.role || 'user',
            enrolled_programs: user.enrolled_programs || []
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleProgramToggle = (programId) => {
        setEditFormData(prev => {
            const current = prev.enrolled_programs;
            if (current.includes(programId)) {
                return { ...prev, enrolled_programs: current.filter(id => id !== programId) };
            } else {
                return { ...prev, enrolled_programs: [...current, programId] };
            }
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    if (adminLoading) {
        return (
            <div className="admin-users-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const isSuperAdmin = currentUserRole === 'super_admin';

    return (
        <div className="admin-users-page">
            {/* Toast Notifications */}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete User"
                    message={`Are you sure you want to delete ${selectedUser?.name || selectedUser?.email}? This action cannot be undone.`}
                    onConfirm={handleDeleteUser}
                    onCancel={() => setShowDeleteModal(false)}
                    confirmText="Delete"
                    type="confirm"
                />
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content edit-user-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit User</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>User: {selectedUser?.name || selectedUser?.email}</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">
                                    Role {!isSuperAdmin && <span style={{ color: '#ff6b6b', fontSize: '0.85em' }}>(Super Admin only)</span>}
                                </label>
                                <select
                                    id="role"
                                    value={editFormData.role}
                                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                                    disabled={!isSuperAdmin}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Course Access</label>
                                {(editFormData.role === 'admin' || editFormData.role === 'super_admin') ? (
                                    <div className="alert-info" style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                                        ℹ️ <strong>{editFormData.role === 'super_admin' ? 'Super Admins' : 'Admins'}</strong> automatically have access to all courses.
                                    </div>
                                ) : (
                                    <div className="course-checkbox-list">
                                        {programs.length === 0 ? (
                                            <p className="text-muted">No programs available.</p>
                                        ) : (
                                            programs.map(program => (
                                                <label key={program.id} className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={editFormData.enrolled_programs.includes(program.id)}
                                                        onChange={() => handleProgramToggle(program.id)}
                                                    />
                                                    <span>{program.title}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleEditUser}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-users-container">
                <div className="admin-users-header">
                    <h1>User Management</h1>
                    <p>Manage all users, their roles, and access permissions{isSuperAdmin ? ' (Super Admin)' : ' (Admin)'}</p>
                </div>

                <div className="admin-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-box">
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="all">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                            <option value="super_admin">Super Admins</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={fetchUsers}>
                        Refresh
                    </button>
                </div>

                <div className="users-stats">
                    <div className="stat-card">
                        <h3>{users.length}</h3>
                        <p>Total Users</p>
                    </div>
                    <div className="stat-card">
                        <h3>{users.filter(u => u.role === 'super_admin').length}</h3>
                        <p>Super Admins</p>
                    </div>
                    <div className="stat-card">
                        <h3>{users.filter(u => u.role === 'admin').length}</h3>
                        <p>Admins</p>
                    </div>
                    <div className="stat-card">
                        <h3>{users.filter(u => u.enrolled_programs && u.enrolled_programs.length > 0).length}</h3>
                        <p>With Course Access</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Enrolled Courses</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="no-users">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name || 'N/A'}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role || 'user'}`}>
                                                    {user.role === 'super_admin' ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : 'User')}
                                                </span>
                                            </td>
                                            <td>
                                                {(user.role === 'admin' || user.role === 'super_admin') ? (
                                                    <span className="access-badge active">All Access (Admin)</span>
                                                ) : (
                                                    user.enrolled_programs && user.enrolled_programs.length > 0 ? (
                                                        <div className="enrolled-courses-list">
                                                            {user.enrolled_programs.map(progId => {
                                                                const prog = programs.find(p => p.id === progId);
                                                                return (
                                                                    <span key={progId} className="course-badge">
                                                                        {prog ? prog.title : 'Unknown Course'}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">No Access</span>
                                                    )
                                                )}
                                            </td>
                                            <td>{user.createdAt?.toLocaleDateString() || 'N/A'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-icon edit"
                                                        onClick={() => openEditModal(user)}
                                                        title="Edit User"
                                                        disabled={user.role === 'super_admin'}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn-icon delete"
                                                        onClick={() => openDeleteModal(user)}
                                                        title="Delete User"
                                                        disabled={user.id === auth.currentUser?.uid || user.role === 'super_admin'}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
