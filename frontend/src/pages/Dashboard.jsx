import { useState, useEffect } from 'react';
import { StatCard, Card, Avatar, StatusBadge, PriorityBadge, Tag, ProgressBar, EmptyState, Spinner } from '../components/UI';
import TaskModal from '../components/TaskModal';
import api from '../utils/api';

export default function Dashboard({ onProjectClick }) {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [dash, projs] = await Promise.all([api.get('/dashboard'), api.get('/projects')]);
      setData(dash.data); setProjects(projs.data.projects);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const isOverdue = t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date();

  if (loading) return <Spinner />;

  const { stats, recent_tasks=[], overdue_tasks=[] } = data || {};

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:20, fontWeight:600 }}>Dashboard</div>
        <div style={{ color:'var(--muted)', fontSize:13 }}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'1.5rem' }}>
        <StatCard label="My Tasks" value={stats?.total||0} color="var(--blue)" />
        <StatCard label="In Progress" value={stats?.in_progress||0} color="var(--amber)" />
        <StatCard label="Completed" value={stats?.done||0} color="var(--green)" />
        <StatCard label="Overdue" value={stats?.overdue||0} color="var(--red)" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:'1rem' }}>
        <Card>
          <div style={{ fontWeight:600, marginBottom:'1rem', fontSize:15 }}>Recent Tasks</div>
          {recent_tasks.length ? recent_tasks.map(t => (
            <div key={t.id} onClick={() => setSelectedTask(t)}
              style={{ background:'var(--surface2)', border:`1px solid ${isOverdue(t) ? 'var(--red)' : 'var(--border)'}`, borderLeft: isOverdue(t) ? '3px solid var(--red)' : '1px solid var(--border)', borderRadius:10, padding:'.9rem 1rem', marginBottom:8, cursor:'pointer' }}>
              <div style={{ fontWeight:500, marginBottom:5 }}>{t.title}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} />
                {t.project && <Tag>{t.project.name}</Tag>}
                {t.assignee && <Avatar user={t.assignee} size={22} />}
                {isOverdue(t) && <span style={{ fontSize:11, color:'var(--red)' }}>⚠ Overdue</span>}
              </div>
            </div>
          )) : <EmptyState message="No tasks yet" />}
        </Card>

        <div>
          <Card style={{ marginBottom:'1rem' }}>
            <div style={{ fontWeight:600, marginBottom:'1rem', fontSize:15 }}>Projects</div>
            {projects.map(p => {
              const tasks = p.task_count || 0;
              const pct = p.completion_pct || 0;
              return (
                <div key={p.id} style={{ marginBottom:'.875rem', cursor:'pointer' }} onClick={() => onProjectClick(p.id)}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                    <span style={{ fontWeight:500, color:p.color }}>{p.name}</span>
                    <span style={{ color:'var(--muted)' }}>{Math.round(pct)}%</span>
                  </div>
                  <ProgressBar pct={pct} color={p.color} />
                </div>
              );
            })}
            {!projects.length && <div style={{ color:'var(--muted)', fontSize:13 }}>No projects</div>}
          </Card>

          {overdue_tasks.length > 0 && (
            <Card style={{ borderColor:'var(--red-d)' }}>
              <div style={{ fontWeight:600, marginBottom:'.75rem', fontSize:15, color:'var(--red-l)' }}>⚠ Overdue</div>
              {overdue_tasks.map((t, i) => (
                <div key={t.id} style={{ fontSize:13, padding:'6px 0', borderBottom: i < overdue_tasks.length-1 ? '1px solid var(--border)' : 'none', display:'flex', justifyContent:'space-between' }}>
                  <span>{t.title}</span>
                  <span style={{ color:'var(--red)', fontSize:11 }}>{t.due_date?.slice(0,10)}</span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSaved={() => { setSelectedTask(null); load(); }} />}
    </div>
  );
}
