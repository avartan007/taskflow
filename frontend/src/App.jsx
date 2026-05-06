import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import Team from './pages/Team';
import MyTasks from './pages/MyTasks';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div style={{ 
      height: '100vh', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '0.05em' }}>INITIALIZING TASKFLOW...</div>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem', marginLeft: '220px' }}>
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ 
      height: '100vh', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
        <div style={{ fontSize: '14px', color: 'var(--muted)', letterSpacing: '0.05em' }}>INITIALIZING...</div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectBoard /></ProtectedRoute>} />
      <Route path="/my-tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
