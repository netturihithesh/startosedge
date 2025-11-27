import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Collaborate from './pages/Collaborate';
import ProgramsDetail from './pages/ProgramsDetail';
import CourseViewer from './pages/CourseViewer';
import Internships from './pages/Internships';
import TaskHub from './pages/TaskHub';
import Profile from './pages/Profile';
import FinishSignUp from './pages/FinishSignUp';
import AdminUsers from './pages/AdminUsers';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    // Global auth listener removed to prevent race conditions during signup
    // Verification is enforced at Login page instead

    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/finishSignUp" element={<FinishSignUp />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected Routes (Require Login + Complete Profile) */}
                    <Route path="/programs" element={
                        <ProtectedRoute>
                            <ProgramsDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/programs/:id" element={
                        <ProtectedRoute>
                            <CourseViewer />
                        </ProtectedRoute>
                    } />
                    <Route path="/internships" element={
                        <ProtectedRoute>
                            <Internships />
                        </ProtectedRoute>
                    } />
                    <Route path="/collaborate" element={
                        <ProtectedRoute>
                            <Collaborate />
                        </ProtectedRoute>
                    } />
                    <Route path="/taskhub" element={
                        <ProtectedRoute>
                            <TaskHub />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute>
                            <AdminUsers />
                        </ProtectedRoute>
                    } />

                    {/* Profile Route (Protected by Login, but allows incomplete profile) */}
                    <Route path="/profile" element={<Profile />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
