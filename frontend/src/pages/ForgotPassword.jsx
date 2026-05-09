import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5001';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState(null); // For local testing demo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    setResetUrl(null);
    
    try {
      const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(data.message);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center mb-4">Forgot Password</h2>
      
      {message && (
        <div className="success-msg mb-4">
          {message}
          {resetUrl && (
            <div className="mt-2" style={{ wordBreak: 'break-all' }}>
              <strong>Demo Reset Link:</strong> <br/>
              <Link to={resetUrl.replace('http://localhost:5173', '')} style={{ textDecoration: 'underline' }}>
                {resetUrl}
              </Link>
            </div>
          )}
        </div>
      )}
      {error && <div className="error-msg mb-4">{error}</div>}
      
      {!message && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            Enter your email address and we will send you a link to reset your password.
          </p>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" required className="input-field"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem', fontSize: '1rem' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
      
      <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
        Remember your password? <Link to="/login" className="text-primary" style={{ color: 'var(--primary-color)' }}>Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
