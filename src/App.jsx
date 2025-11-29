import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const Collaborate = React.lazy(() => import('./pages/Collaborate'));
const ProgramsDetail = React.lazy(() => import('./pages/ProgramsDetail'));
const CourseViewer = React.lazy(() => import('./pages/CourseViewer'));
const Internships = React.lazy(() => import('./pages/Internships'));
const TaskHub = React.lazy(() => import('./pages/TaskHub'));
const Profile = React.lazy(() => import('./pages/Profile'));
const FinishSignUp = React.lazy(() => import('./pages/FinishSignUp'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers'));
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
                <React.Suspense fallback={<Loading />}>
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
                </React.Suspense>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
