import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Btn } from '../components/UI';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'admin@demo.com', password:'admin123', role:'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => { setIsLogin(v => !v); setError(''); setForm(f => ({...f, email:'', password:''})); };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:380 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:28, fontWeight:700, color:'var(--blue)', letterSpacing:-1 }}>⬡ TaskFlow</div>
          <div style={{ color:'var(--muted)', fontSize:13, marginTop:4 }}>Team project management</div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.75rem' }} className="fade-in">
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:'1.25rem' }}>{isLogin ? 'Sign in' : 'Create account'}</h2>
          {error && <Alert>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:5 }}>Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
              </div>
            )}
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:5 }}>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:5 }}>Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" required />
            </div>
            {!isLogin && (
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:5 }}>Role</label>
                <select value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', marginTop:'.5rem', cursor:'pointer', border:'none', borderRadius:10, padding:'10px 18px', fontFamily:'inherit', fontSize:14, fontWeight:500, background:'var(--blue)', color:'#fff', opacity: loading ? .7 : 1 }}>
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'1rem', fontSize:13, color:'var(--muted)' }}>
            {isLogin ? 'No account? ' : 'Have an account? '}
            <a href="#" onClick={e => { e.preventDefault(); toggle(); }} style={{ color:'var(--blue)' }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </a>
          </div>

          {isLogin && (
            <>
              <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'1rem 0' }} />
              <div style={{ fontSize:12, color:'var(--muted)' }}>
                <strong style={{ color:'var(--text)' }}>Demo credentials:</strong><br />
                Admin: admin@demo.com / admin123<br />
                Member: maya@demo.com / maya123
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
