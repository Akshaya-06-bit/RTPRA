import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]     = useState({ username: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {

  e.preventDefault();

  setError('');

  setLoading(true);

  try {

    console.log("FORM DATA:", form);

    const response = await register(
      form.username,
      form.email,
      form.password
    );

    console.log("SUCCESS:", response);

    navigate('/');

  } catch (err) {

    console.log("FULL ERROR:", err);

    console.log("ERROR RESPONSE:", err.response);

    console.log("ERROR DATA:", err.response?.data);

    if (err.response?.data?.message) {

      setError(err.response.data.message);

    } else if (err.response?.data?.errors?.length > 0) {

      setError(err.response.data.errors[0].msg);

    } else {

      setError('Registration failed');
    }

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <span className="auth-logo-icon">⚡</span>
          <h1>RTPRA</h1>
        </div>
        <p className="auth-subtitle">Create your account</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" placeholder="johndoe"
              value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="min 6 characters"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
