import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import Team from './pages/Team';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
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
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectBoard /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
