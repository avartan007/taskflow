import { useState, useEffect } from 'react';
import { Btn, Avatar, Spinner, EmptyState } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:20, fontWeight:600 }}>Team Members</div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0, padding:'1rem', background:'var(--surface2)', fontWeight:500, fontSize:13, color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
        </div>
        {users.length ? (
          users.map((u, i) => (
            <div key={u.id} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0, padding:'1rem', borderBottom: i < users.length-1 ? '1px solid var(--border)' : 'none', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Avatar user={u} size={32} />
                <span style={{ fontWeight:500 }}>{u.name}</span>
              </div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>{u.email}</div>
              <div style={{ fontSize:12, padding:'4px 8px', background:'var(--surface2)', borderRadius:6, display:'inline-block', width:'fit-content' }}>
                {u.role === 'admin' ? '👑 Admin' : '👤 Member'}
              </div>
              <div style={{ fontSize:12, color:'var(--green)' }}>Active</div>
            </div>
          ))
        ) : (
          <div style={{ padding:'2rem', textAlign:'center' }}><EmptyState message="No team members" /></div>
        )}
      </div>
    </div>
  );
}
