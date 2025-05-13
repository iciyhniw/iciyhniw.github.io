import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import firebase from './FirebaseConf';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import './cssfiles/Main.css'
import './cssfiles/Home.css'
import './cssfiles/Courses.css'
import './cssfiles/Profile.css'
import './cssfiles/AuthForm.css'
import './cssfiles/Footer.css'
import './cssfiles/Schedule.css'
import './cssfiles/Header.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { auth } = firebase;

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.uid);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
      <>
          <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />
          <Router>
              <Header isLoggedIn={isLoggedIn} onLoginChange={setIsLoggedIn} setShowModal={setShowModal} />
              <LoginModal showModal={showModal} setShowModal={setShowModal} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses isLoggedIn={isLoggedIn} />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/schedule" element={<Schedule />} />
              </Routes>
              <Footer />
          </Router>
      </>
  );
}

export default App;