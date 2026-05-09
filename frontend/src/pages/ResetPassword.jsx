import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5001';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center mb-4">Reset Password</h2>
      
      {message && <div className="success-msg mb-4">{message} Redirecting to login...</div>}
      {error && <div className="error-msg mb-4">{error}</div>}
      
      {!message && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">New Password</label>
            <input 
              type="password" required className="input-field" minLength="6"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Confirm New Password</label>
            <input 
              type="password" required className="input-field" minLength="6"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem', fontSize: '1rem' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      
      <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
        Back to <Link to="/login" className="text-primary" style={{ color: 'var(--primary-color)' }}>Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;
