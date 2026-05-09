import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center mb-4">Login</h2>
      {error && <div className="error-msg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input 
            type="email" required className="input-field"
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input 
            type="password" required className="input-field"
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem', fontSize: '1rem' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="text-center mt-4" style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <Link to="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Forgot Password?</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register" className="text-primary" style={{ color: 'var(--primary-color)' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
