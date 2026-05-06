import { useState } from 'react';

const s = {
  btn: (variant='primary', size='md') => ({
    cursor: 'pointer', borderRadius: 10, fontFamily: 'inherit',
    fontSize: size === 'sm' ? 13 : 14, fontWeight: 500,
    padding: size === 'sm' ? '5px 12px' : '9px 18px',
    transition: 'all .15s',
    background: variant === 'primary' ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' :
                variant === 'danger'  ? 'var(--red-d)' : 'transparent',
    color: variant === 'primary' ? '#fff' :
           variant === 'danger'  ? 'var(--red-l)' : 'var(--muted)',
    border: variant === 'ghost' ? '1px solid var(--border)' :
            variant === 'danger' ? '1px solid var(--red-d)' : 'none',
  }),
};

export const Btn = ({ variant='primary', size='md', onClick, disabled, children, style={} }) => (
  <button style={{ ...s.btn(variant, size), opacity: disabled ? .5 : 1, ...style }}
    onClick={onClick} disabled={disabled}>{children}</button>
);

export const Badge = ({ color='primary', children }) => {
  const map = { 
    primary:'#5b21b6:#ddd6fe', 
    secondary:'#0369a1:#06b6d4', 
    green:'#047857:#6ee7b7', 
    amber:'#d97706:#fbbf24', 
    red:'#dc2626:#fca5a5', 
    purple:'#6d28d9:#ddd6fe' 
  };
  const [bg, fg] = (map[color] || map.primary).split(':');
  return <span style={{ display:'inline-flex', alignItems:'center', padding:'2px 9px', borderRadius:20, fontSize:12, fontWeight:500, background:bg, color:fg }}>{children}</span>;
};

export const StatusBadge = ({ status }) => {
  const m = { 'todo': ['secondary','Todo'], 'in-progress': ['amber','In Progress'], 'done': ['green','Done'] };
  const [c, l] = m[status] || ['primary','Unknown'];
  return <Badge color={c}>{l}</Badge>;
};

export const PriorityBadge = ({ priority }) => {
  const m = { high:'red', medium:'amber', low:'green' };
  return <Badge color={m[priority]||'blue'}>{priority}</Badge>;
};

export const Avatar = ({ user, size=28 }) => {
  if (!user) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      background: (user.color||'#7c3aed') + '22', color: user.color||'#7c3aed',
      fontSize: Math.round(size*.38), fontWeight: 600,
    }}>{user.initials || user.name?.slice(0,2).toUpperCase()}</div>
  );
};

export const Card = ({ children, style={} }) => (
  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1.25rem', ...style }}>{children}</div>
);

export const Modal = ({ title, onClose, children }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1001, padding:'1rem' }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', padding:'1.5rem', width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }} className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
        <h3 style={{ fontSize:16, fontWeight:600 }}>{title}</h3>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:20, lineHeight:1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

export const FormGroup = ({ label, children }) => (
  <div style={{ marginBottom:'1rem' }}>
    <label style={{ display:'block', fontSize:13, color:'var(--muted)', marginBottom:5 }}>{label}</label>
    {children}
  </div>
);

export const FormRow = ({ children }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>{children}</div>
);

export const StatCard = ({ label, value, color='var(--text)' }) => (
  <div style={{ background:'var(--surface2)', borderRadius:'var(--radius)', padding:'1rem', border:'1px solid var(--border)' }}>
    <div style={{ fontSize:26, fontWeight:600, marginBottom:2, color }}>{value}</div>
    <div style={{ fontSize:12, color:'var(--muted)' }}>{label}</div>
  </div>
);

export const EmptyState = ({ icon='✓', message }) => (
  <div style={{ textAlign:'center', padding:'3rem 1rem', color:'var(--muted)' }}>
    <div style={{ fontSize:36, marginBottom:'.75rem' }}>{icon}</div>
    <div>{message}</div>
  </div>
);

export const Tag = ({ children }) => (
  <span style={{ display:'inline-block', padding:'1px 7px', borderRadius:4, fontSize:11, background:'var(--surface3)', color:'var(--muted)', fontFamily:"'DM Mono',monospace" }}>{children}</span>
);

export const ProgressBar = ({ pct, color='var(--blue)' }) => (
  <div style={{ height:4, background:'var(--surface3)', borderRadius:2, overflow:'hidden' }}>
    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width .3s' }} />
  </div>
);

export const Spinner = () => <div style={{ display:'flex', justifyContent:'center', padding:'3rem' }}><div className="spinner" /></div>;

export const Alert = ({ type='error', children }) => {
  const m = { error: ['var(--red-d)','var(--red-l)'], success: ['var(--green-d)','var(--green-l)'] };
  const [bg, fg] = m[type]||m.error;
  return <div style={{ background:bg, color:fg, padding:'9px 12px', borderRadius:8, fontSize:13, marginBottom:'1rem' }}>{children}</div>;
};
