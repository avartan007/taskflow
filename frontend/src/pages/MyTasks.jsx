import { useState, useEffect } from 'react';
import { Card, StatusBadge, PriorityBadge, Tag, EmptyState, Spinner } from '../components/UI';
import TaskModal from '../components/TaskModal';
import api from '../utils/api';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    api.get('/tasks/me')
      .then(r => setTasks(r.data.tasks))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;

  const isOverdue = t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date();

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:20, fontWeight:600 }}>My Tasks</div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {tasks.length ? tasks.map((t, i) => (
          <div key={t.id} onClick={() => setModal(t)}
            style={{ 
              padding:'1rem 1.25rem', 
              borderBottom: i < tasks.length-1 ? '1px solid var(--border)' : 'none', 
              cursor:'pointer', 
              borderLeft: isOverdue(t) ? '3px solid var(--red)' : '3px solid transparent',
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, marginBottom:6, fontSize: 15 }}>{t.title}</div>
                <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap: 'wrap' }}>
                  <StatusBadge status={t.status} />
                  <PriorityBadge priority={t.priority} />
                  {t.project && <Tag>{t.project.name}</Tag>}
                  {(t.tags||[]).map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:12, color: isOverdue(t) ? 'var(--red)' : 'var(--muted)', marginTop:3 }}>
                  {isOverdue(t) ? '⚠ ' : ''}{t.due_date?.slice(0,10) || 'No due date'}
                </div>
              </div>
            </div>
          </div>
        )) : <div style={{ padding: '2rem' }}><EmptyState message="You have no tasks assigned to you" /></div>}
      </Card>

      {modal && (
        <TaskModal
          task={modal}
          projectId={modal.project_id}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
