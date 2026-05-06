import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Btn, Card } from '../components/UI';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'admin@demo.com', password:'admin123', role:'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthPage mounted');
    return () => console.log('AuthPage unmounted');
  }, []);

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

  const toggle = () => { setIsLogin(v => !v); setError(''); setForm(f => ({...f, name:'', email:'', password:''})); };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding: '1rem' }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:32, fontWeight:800, color:'var(--primary)', letterSpacing:-1.5 }}>⬡ TaskFlow</div>
          <div style={{ color:'var(--muted)', fontSize:14, marginTop:6 }}>Streamlined Team Management</div>
        </div>

        <Card style={{ padding:'2rem' }} className="fade-in">
          <h2 style={{ fontSize:20, fontWeight:700, marginBottom:'1.5rem', color:'var(--text)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          {error && <Alert>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:6 }}>Full Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alex Smith" required />
              </div>
            )}
            <div style={{ marginBottom:'1.25rem' }}>
              <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:6 }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:6 }}>Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required />
            </div>
            
            <Btn type="submit" disabled={loading} style={{ width:'100%', padding: '12px' }}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Btn>
          </form>

          <div style={{ textAlign:'center', marginTop:'1.5rem', fontSize:14, color:'var(--muted)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggle} style={{ background:'none', border:'none', padding:0, color:'var(--primary)', fontWeight:600, cursor:'pointer' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {isLogin && (
            <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border)' }}>
              <div style={{ fontSize:12, color:'var(--muted)', background: 'var(--surface2)', padding: '12px', borderRadius: 8 }}>
                <strong style={{ color:'var(--primary-l)', display: 'block', marginBottom: 4 }}>DEMO ACCESS:</strong>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Admin:</span> <span>admin@demo.com / admin123</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop: 4 }}><span>Member:</span> <span>maya@demo.com / maya123</span></div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
