import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Btn, ProgressBar, Avatar, EmptyState, Spinner } from '../components/UI';
import ProjectModal from '../components/ProjectModal';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    api.get('/projects').then(r => setProjects(r.data.projects)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:20, fontWeight:600 }}>Projects</div>
        {(user?.role === 'admin' || user?.role === 'manager') && <Btn onClick={() => setShowModal(true)}>+ New Project</Btn>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1rem' }}>
        {projects.map(p => {
          const pct = p.completion_pct || 0;
          const members = p.members || [];
          return (
            <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor:'pointer' }}>
              <Card style={{ borderTop:`3px solid ${p.color}`, transition:'border-color .15s' }}>
                <div style={{ fontWeight:600, fontSize:15, marginBottom:'.25rem' }}>{p.name}</div>
                <div style={{ fontSize:13, color:'var(--muted)', marginBottom:'.875rem' }}>{p.description || 'No description'}</div>
                <ProgressBar pct={pct} color={p.color} />
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'.5rem' }}>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{Math.round(pct)}% complete</div>
                  <div style={{ display:'flex' }}>
                    {(members.slice ? members.slice(0,4) : []).map((m, i) => (
                      <div key={m.id} style={{ marginLeft: i > 0 ? -6 : 0 }}><Avatar user={m} size={26} /></div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
        {!projects.length && <EmptyState icon="⬒" message="No projects yet" />}
      </div>

      {showModal && <ProjectModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); load(); }} />}
    </div>
  );
}
