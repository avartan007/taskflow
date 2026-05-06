import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Btn, StatusBadge, PriorityBadge, Tag, Avatar, EmptyState, Spinner } from '../components/UI';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLS = [
  { key:'todo', label:'To Do', color:'var(--blue)' },
  { key:'in-progress', label:'In Progress', color:'var(--amber)' },
  { key:'done', label:'Done', color:'var(--green)' },
];

export default function ProjectBoard() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState('kanban');
  const [search, setSearch] = useState('');
  const [filterMine, setFilterMine] = useState(false);
  const [modal, setModal] = useState(null); // null | 'new' | task object
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [pr, tr] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`),
      ]);
      setProject(pr.data.project);
      setTasks(tr.data.tasks);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [projectId]);

  if (loading) return <Spinner />;
  if (!project) return <div style={{ padding:'2rem', color:'var(--muted)' }}>Project not found</div>;

  const isOverdue = t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date();

  const filtered = tasks.filter(t => {
    if (filterMine && t.assignee_id !== user.id) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TaskCard = ({ task }) => (
    <div onClick={() => setModal(task)}
      style={{ background:'var(--surface2)', border:`1px solid ${isOverdue(task)?'var(--red)':'var(--border)'}`, borderLeft: isOverdue(task) ? '3px solid var(--red)' : undefined,
        borderRadius:10, padding:'.9rem 1rem', marginBottom:8, cursor:'pointer', transition:'border-color .15s' }}>
      <div style={{ fontWeight:500, marginBottom:5, fontSize:14 }}>{task.title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:6 }}>
        <PriorityBadge priority={task.priority} />
        {(task.tags||[]).map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        {task.assignee ? <Avatar user={task.assignee} size={24} /> : <span />}
        <span style={{ fontSize:11, color: isOverdue(task) ? 'var(--red)' : 'var(--muted)' }}>{task.due_date?.slice(0,10)||''}</span>
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', marginBottom:2 }}>Project</div>
          <div style={{ fontSize:20, fontWeight:600, color:project.color }}>{project.name}</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 13px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'var(--muted)' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
              style={{ border:'none', background:'transparent', padding:0, width:150 }} />
          </div>
          <select value={filterMine ? 'mine' : 'all'} onChange={e => setFilterMine(e.target.value === 'mine')}
            style={{ width:'auto' }}>
            <option value="all">All members</option>
            <option value="mine">My tasks</option>
          </select>
          <Btn onClick={() => setModal('new')}>+ Task</Btn>
        </div>
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:'1.25rem', background:'var(--surface2)', borderRadius:10, padding:4 }}>
        {['kanban','list'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'7px 16px', borderRadius:8, cursor:'pointer', fontSize:13, border:'none',
              background: tab === t ? 'var(--surface)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--muted)', fontWeight: tab === t ? 500 : 400 }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'kanban' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key);
            return (
              <div key={col.key} style={{ background:'var(--surface2)', borderRadius:10, padding:'.875rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem', fontSize:13, fontWeight:600 }}>
                  <span>{col.label}</span>
                  <span style={{ background:'var(--surface3)', padding:'1px 8px', borderRadius:20, fontSize:12 }}>{colTasks.length}</span>
                </div>
                {colTasks.map(t => <TaskCard key={t.id} task={t} />)}
                {!colTasks.length && <div style={{ textAlign:'center', padding:'1.5rem 0', color:'var(--faint)', fontSize:12 }}>Empty</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
          {filtered.length ? filtered.map((t, i) => (
            <div key={t.id} onClick={() => setModal(t)}
              style={{ padding:'.9rem 1rem', borderBottom: i < filtered.length-1 ? '1px solid var(--border)' : 'none', cursor:'pointer', borderLeft: isOverdue(t) ? '3px solid var(--red)' : 'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:500, marginBottom:4 }}>{t.title}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                    {(t.tags||[]).map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  {t.assignee && <Avatar user={t.assignee} size={28} />}
                  <div style={{ fontSize:11, color: isOverdue(t) ? 'var(--red)' : 'var(--muted)', marginTop:3 }}>{t.due_date?.slice(0,10)||''}</div>
                </div>
              </div>
            </div>
          )) : <EmptyState message="No tasks match your filters" />}
        </div>
      )}

      {modal && (
        <TaskModal
          task={modal === 'new' ? null : modal}
          projectId={projectId}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
