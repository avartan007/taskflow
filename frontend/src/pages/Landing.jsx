import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Just keep the scroll event for other effects if needed
    const handleScroll = () => {
      // Future scroll logic
    };
    window.addEventListener('scroll', handleScroll);
    
    // Add mouse tracking for bento card glow effect
    const handleMouseMove = (e) => {
      for(const card of document.querySelectorAll('.bento-card')) {
        const rect = card.getBoundingClientRect(),
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="landing">
      <div className="landing-bg"></div>
      <div className="landing-grid"></div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">⬡</div>
            <span>TaskFlow</span>
          </div>
          <div className="nav-actions">
            {user ? (
              <button className="nav-btn signup" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="nav-btn signin" onClick={() => navigate('/login')}>Sign In</button>
                <button className="nav-btn signup" onClick={() => navigate('/login')}>Get Started</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          ✨ TaskFlow 2.0 is now live
        </div>
        <h1 className="hero-title">
          The new standard for <br/>
          <span className="text-emerald">team coordination.</span>
        </h1>
        <p className="hero-subtitle">
          Experience a beautiful, fast, and intelligent project management platform designed for modern product teams. Stop tracking tasks, start shipping features.
        </p>
        <div className="hero-actions">
          <button className="btn-large btn-primary" onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Open Dashboard' : 'Start for free'} →
          </button>
          <button className="btn-large btn-secondary" onClick={() => {
            document.querySelector('.preview-container').scrollIntoView({ behavior: 'smooth' });
          }}>
            Explore the app
          </button>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section className="trusted-section">
        <div className="trusted-text">Trusted by modern engineering teams</div>
        <div className="marquee-container">
          <div className="marquee">
            <div className="company-logo">⬡ Acme Corp</div>
            <div className="company-logo">⚡️ Zapier</div>
            <div className="company-logo">▲ Vercel</div>
            <div className="company-logo">⌘ Linear</div>
            <div className="company-logo">✧ Raycast</div>
            <div className="company-logo">⬡ Acme Corp</div>
            <div className="company-logo">⚡️ Zapier</div>
            <div className="company-logo">▲ Vercel</div>
            <div className="company-logo">⌘ Linear</div>
            <div className="company-logo">✧ Raycast</div>
          </div>
        </div>
      </section>

      {/* 3D Dashboard Preview */}
      <section className="preview-container">
        <div className="preview-window">
          <div className="preview-header">
            <div className="dot r"></div>
            <div className="dot y"></div>
            <div className="dot g"></div>
            <div className="preview-url">🔒 taskflow.app/acme/project-alpha</div>
          </div>
          <div className="preview-body">
            <div className="preview-sidebar">
              <div className="nav-item-mock active"><div className="mock-icon"></div><span>Dashboard</span></div>
              <div className="nav-item-mock"><div className="mock-icon"></div><span>Projects</span></div>
              <div className="nav-item-mock"><div className="mock-icon"></div><span>Tasks</span></div>
              <div className="nav-item-mock"><div className="mock-icon"></div><span>Team</span></div>
              <div className="nav-item-mock" style={{marginTop:'2rem'}}><div className="mock-icon"></div><span>Settings</span></div>
            </div>
            <div className="preview-main">
              <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', opacity: 0.8 }}>Active Project: Alpha</h4>
              <div className="mock-kanban">
                <div className="mock-col">
                  <div className="mock-col-header"><div className="mock-col-title">To Do</div></div>
                  <div className="mock-card-task">
                    <div className="mock-task-title">Design System Audit</div>
                    <div className="mock-task-meta"><div className="mock-tag red">High</div></div>
                    <div className="mock-task-footer"><span style={{fontSize: 10, opacity: 0.5}}>May 12</span><div className="mock-avatar"></div></div>
                  </div>
                  <div className="mock-card-task">
                    <div className="mock-task-title">API Integration</div>
                    <div className="mock-task-meta"><div className="mock-tag blue">Medium</div></div>
                    <div className="mock-task-footer"><span style={{fontSize: 10, opacity: 0.5}}>May 14</span><div className="mock-avatar"></div></div>
                  </div>
                </div>
                <div className="mock-col">
                  <div className="mock-col-header"><div className="mock-col-title">In Progress</div></div>
                  <div className="mock-card-task">
                    <div className="mock-task-title">Mobile Responsive Fix</div>
                    <div className="mock-task-meta"><div className="mock-tag">Low</div><div className="mock-tag blue">UI</div></div>
                    <div className="mock-task-footer"><span style={{fontSize: 10, opacity: 0.5}}>Today</span><div className="mock-avatar"></div></div>
                  </div>
                </div>
                <div className="mock-col">
                  <div className="mock-col-header"><div className="mock-col-title">Done</div></div>
                  <div className="mock-card-task" style={{opacity: 0.4}}>
                    <div className="mock-task-title" style={{textDecoration:'line-through'}}>Initial Setup</div>
                    <div className="mock-task-footer"><span style={{fontSize: 10, opacity: 0.5}}>Completed</span><div className="mock-avatar"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="features-section">
        <div className="section-header landing-fade-in">
          <h2 className="section-title">Everything you need to build faster.</h2>
          <p className="hero-subtitle" style={{ marginBottom: 0 }}>Powerful workflows wrapped in a beautifully simple interface.</p>
        </div>

        <div className="bento-grid">
          <div className="bento-card large landing-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bento-icon">📊</div>
            <h3>Intelligent Dashboard</h3>
            <p>Get a bird's-eye view of your entire organization. Track progress, identify blockers, and monitor team velocity in real-time across all active projects.</p>
          </div>
          
          <div className="bento-card landing-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bento-icon">⚡️</div>
            <h3>Lightning Fast</h3>
            <p>Built with modern web technologies, TaskFlow responds instantly. No loading spinners, no waiting. Just pure productivity.</p>
          </div>

          <div className="bento-card landing-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bento-icon">🛡️</div>
            <h3>Enterprise Security</h3>
            <p>Bank-grade encryption, secure JWT authentication, and strict role-based access control out of the box.</p>
          </div>

          <div className="bento-card large landing-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bento-icon">🤝</div>
            <h3>Seamless Collaboration</h3>
            <p>Assign tasks, set priorities, and track due dates. Whether you're an Admin, Manager, or Member, you'll have exactly the permissions you need to do your best work.</p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles-section">
        <div className="section-header landing-fade-in">
          <h2 className="section-title">Built for every team member.</h2>
          <p className="hero-subtitle" style={{ marginBottom: 0 }}>Granular permissions ensure everyone sees exactly what they need.</p>
        </div>
        
        <div className="roles-grid">
          <div className="role-card landing-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="role-badge">👑</div>
            <h3>Admin</h3>
            <p className="role-desc">Full system access, user management, and complete project control.</p>
            <ul className="role-list">
              <li><span className="check-icon">✓</span> Manage all users</li>
              <li><span className="check-icon">✓</span> Create any project</li>
              <li><span className="check-icon">✓</span> View all tasks</li>
            </ul>
          </div>

          <div className="role-card landing-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="role-badge">📊</div>
            <h3>Manager</h3>
            <p className="role-desc">Manage your projects and coordinate team members effectively.</p>
            <ul className="role-list">
              <li><span className="check-icon">✓</span> Create projects</li>
              <li><span className="check-icon">✓</span> Assign team members</li>
              <li><span className="check-icon">✓</span> Monitor progress</li>
            </ul>
          </div>

          <div className="role-card landing-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="role-badge">👤</div>
            <h3>Member</h3>
            <p className="role-desc">Collaborate on assigned projects and complete your tasks.</p>
            <ul className="role-list">
              <li><span className="check-icon">✓</span> View assigned projects</li>
              <li><span className="check-icon">✓</span> Update task status</li>
              <li><span className="check-icon">✓</span> Collaborate with team</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section landing-fade-in" style={{ animationDelay: '0.2s' }}>
        <h2 className="cta-title">Ready to transform your workflow?</h2>
        <p className="cta-subtitle" style={{ fontSize: '1.25rem' }}>Join top tier teams using TaskFlow to ship better products.</p>
        <button className="btn-large btn-primary" onClick={() => navigate(user ? '/dashboard' : '/login')} style={{ marginTop: '1rem' }}>
          {user ? 'Go to Dashboard' : 'Get Started Now'}
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h4><span className="logo-icon">⬡</span> TaskFlow</h4>
            <p>Modern project management for modern teams. Stop tracking tasks and start shipping features.</p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TaskFlow Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
