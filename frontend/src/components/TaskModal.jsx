import { useState, useEffect } from 'react';
import { Modal, FormGroup, FormRow, Btn, Alert } from './UI';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function TaskModal({ task, projectId, onClose, onSaved }) {
  const { user } = useAuth();
  const isEdit = !!task?.id;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    project_id: task?.project_id || projectId || '',
    assignee_id: task?.assignee_id || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    due_date: task?.due_date?.slice(0,10) || '',
    tags: (task?.tags || []).join(', '),
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/users')])
      .then(([pr, ur]) => { setProjects(pr.data.projects); setUsers(ur.data.users); });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError('Title is required');
    setLoading(true); setError('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
      if (isEdit) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${task.id}`); onSaved(); } catch {}
  };

  const canEdit = user?.role === 'admin' || task?.assignee_id === user?.id || !isEdit;

  return (
    <Modal title={isEdit ? 'Edit Task' : 'New Task'} onClose={onClose}>
      {error && <Alert>{error}</Alert>}
      <FormGroup label="Title *">
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Task title" disabled={!canEdit} />
      </FormGroup>
      <FormGroup label="Description">
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Optional description" disabled={!canEdit} />
      </FormGroup>
      <FormRow>
        <FormGroup label="Project">
          <select value={form.project_id} onChange={e => set('project_id', e.target.value)} disabled={isEdit}>
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </FormGroup>
        <FormGroup label="Assignee">
          <select value={form.assignee_id} onChange={e => set('assignee_id', e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Status">
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </FormGroup>
        <FormGroup label="Priority">
          <select value={form.priority} onChange={e => set('priority', e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Due Date">
          <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
        </FormGroup>
        <FormGroup label="Tags (comma-separated)">
          <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="design, frontend" />
        </FormGroup>
      </FormRow>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:'.5rem' }}>
        {isEdit && user?.role === 'admin' && (
          <Btn variant="danger" size="sm" onClick={handleDelete}>Delete</Btn>
        )}
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}</Btn>
      </div>
    </Modal>
  );
}
