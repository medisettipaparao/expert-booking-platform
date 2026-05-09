import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 className="text-center mb-4">Create an Account</h2>
      {error && <div className="error-msg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input 
            type="text" required className="input-field"
            value={name} onChange={e => setName(e.target.value)}
          />
        </div>
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
            type="password" required className="input-field" minLength="6"
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem', fontSize: '1rem' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
        Already have an account? <Link to="/login" className="text-primary" style={{ color: 'var(--primary-color)' }}>Login</Link>
      </div>
    </div>
  );
}

export default Register;
