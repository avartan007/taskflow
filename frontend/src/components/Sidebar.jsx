import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './UI';

const NavItem = ({ icon, label, path, active, onClick }) => (
  <div onClick={onClick}
    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', color: active ? 'var(--blue-l)' : 'var(--muted)',
      background: active ? 'var(--blue-d)' : 'transparent', borderRadius:8, cursor:'pointer', transition:'all .15s',
      fontSize:13.5, margin:'1px 8px' }}
    onMouseEnter={e => { if(!active) e.currentTarget.style.background='var(--surface2)'; e.currentTarget.style.color='var(--text)'; }}
    onMouseLeave={e => { if(!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--muted)'; }}}>
    <span style={{ fontSize:15, width:20, textAlign:'center' }}>{icon}</span>
    <span>{label}</span>
  </div>
);

export default function Sidebar({ projects }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div style={{ width:220, background:'var(--surface)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', height:'100vh', position:'fixed', left:0, top:0, zIndex:100 }}>
      <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)' }}>
        <div style={{ fontSize:16, fontWeight:700, color:'var(--blue)', letterSpacing:'-.5px' }}>⬡ TaskFlow</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'.5rem 0' }}>
        <NavItem icon="◈" label="Dashboard" active={location.pathname === '/dashboard'}
          onClick={() => navigate('/dashboard')} />
        <NavItem icon="⬒" label="Projects" active={location.pathname === '/projects'}
          onClick={() => navigate('/projects')} />
        <NavItem icon="✓" label="My Tasks" active={location.pathname === '/my-tasks'}
          onClick={() => navigate('/my-tasks')} />
        {user?.role === 'admin' && (
          <NavItem icon="⊕" label="Team" active={location.pathname === '/team'}
            onClick={() => navigate('/team')} />
        )}

        {projects?.length > 0 && (
          <>
            <div style={{ padding:'.5rem 1rem .25rem', fontSize:11, color:'var(--faint)', textTransform:'uppercase', letterSpacing:'.07em', marginTop:'.5rem' }}>
              Projects
            </div>
            {projects.map(p => (
              <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', color: location.pathname === `/projects/${p.id}` ? 'var(--blue-l)' : 'var(--muted)',
                  background: location.pathname === `/projects/${p.id}` ? 'var(--blue-d)' : 'transparent', borderRadius:8, cursor:'pointer', fontSize:13.5, margin:'1px 8px', transition:'all .15s' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:p.color, flexShrink:0, display:'inline-block' }} />
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ padding:'.75rem 1rem', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
        <Avatar user={user} size={34} />
        <div style={{ overflow:'hidden', flex:1 }}>
          <div style={{ fontSize:13, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
          <div style={{ fontSize:11, color:'var(--muted)' }}>{user?.role}</div>
        </div>
        <button onClick={logout} title="Logout"
          style={{ background:'none', border:'1px solid var(--border)', borderRadius:8, color:'var(--muted)', cursor:'pointer', padding:'4px 8px', fontSize:13 }}>↩</button>
      </div>
    </div>
  );
}
