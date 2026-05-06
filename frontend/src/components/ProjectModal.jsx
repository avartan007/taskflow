import { useState, useEffect } from 'react';
import { Modal, FormGroup, Btn, Alert, Avatar } from './UI';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = ['#4f8ef7','#9b6dff','#3dba7f','#f5a623','#e05252','#20c9c9','#f06292','#ff8a65'];

export default function ProjectModal({ onClose, onSaved }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name:'', description:'', color:'#4f8ef7', member_ids:[] });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.users));
  }, []);

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      member_ids: f.member_ids.includes(id) ? f.member_ids.filter(x => x !== id) : [...f.member_ids, id]
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Name is required');
    setLoading(true); setError('');
    try {
      const ids = [...new Set([user.id, ...form.member_ids])];
      await api.post('/projects', { ...form, member_ids: ids });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Project" onClose={onClose}>
      {error && <Alert>{error}</Alert>}
      <FormGroup label="Name *">
        <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Project name" />
      </FormGroup>
      <FormGroup label="Description">
        <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} placeholder="What is this project about?" />
      </FormGroup>
      <FormGroup label="Color">
        <div style={{ display:'flex', gap:8, marginTop:4 }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => setForm(f => ({...f, color:c}))}
              style={{ width:26, height:26, borderRadius:'50%', background:c, cursor:'pointer', border:`2px solid ${form.color===c ? 'white' : 'transparent'}`, transition:'border .15s' }} />
          ))}
        </div>
      </FormGroup>
      <FormGroup label="Members">
        {users.map(u => (
          <label key={u.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', cursor:'pointer' }}>
            <input type="checkbox" checked={form.member_ids.includes(u.id) || u.id === user.id}
              onChange={() => { if(u.id !== user.id) toggleMember(u.id); }}
              disabled={u.id === user.id} style={{ width:'auto' }} />
            <Avatar user={u} size={24} />
            <span style={{ fontSize:13 }}>{u.name}</span>
            <span style={{ fontSize:11, color:'var(--muted)', marginLeft:'auto' }}>{u.role}</span>
          </label>
        ))}
      </FormGroup>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</Btn>
      </div>
    </Modal>
  );
}
