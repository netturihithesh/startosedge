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
import ScrollToTop from './components/ScrollToTop';
import './App.css';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !user.emailVerified) {
                // If user is logged in but not verified, sign them out
                console.log("User not verified, signing out...");
                auth.signOut();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/programs" element={<ProgramsDetail />} />
                    <Route path="/programs/:id" element={<CourseViewer />} />
                    <Route path="/internships" element={<Internships />} />
                    <Route path="/collaborate" element={<Collaborate />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/taskhub" element={<TaskHub />} />
                    <Route path="/finishSignUp" element={<FinishSignUp />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
