import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar, Users, LogOut, User } from 'lucide-react';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthContext } from './context/AuthContext';
import './index.css';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <Calendar className="w-6 h-6" />
            Vedaz Booking
          </Link>
          <div className="navbar-links" style={{ alignItems: 'center' }}>
            <Link to="/" className="nav-link"><Users className="w-4 h-4 inline mr-1" /> Experts</Link>
            {user ? (
              <>
                <Link to="/bookings" className="nav-link"><Calendar className="w-4 h-4 inline mr-1" /> My Bookings</Link>
                <div className="nav-link" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={logout}>
                  <User className="w-4 h-4" /> {user.name} <LogOut className="w-4 h-4 ml-2" />
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Login</Link>
            )}
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ExpertList />} />
            <Route path="/expert/:id" element={<ExpertDetail />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
