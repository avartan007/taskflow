import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">⬡</div>
            <span>TaskFlow</span>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn signin" onClick={() => navigate('/login')}>Sign In</button>
            <button className="nav-btn signup" onClick={() => navigate('/login')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-bg">
          <div className="gradient-orb orb-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }}></div>
          <div className="gradient-orb orb-2" style={{ transform: `translateY(${scrollY * 0.4}px)` }}></div>
          <div className="gradient-orb orb-3" style={{ transform: `translateY(${scrollY * 0.35}px)` }}></div>
        </div>

        <div className="hero-content fade-in-down">
          <h1 className="hero-title">
            Manage Your Team, <span className="gradient-text">Master Your Projects</span>
          </h1>
          <p className="hero-subtitle">
            Streamline project management with real-time collaboration, task tracking, and team coordination in one powerful platform.
          </p>

          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Start For Free
              <span className="btn-arrow">→</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                document.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Task Tracking</div>
            </div>
            <div className="stat">
              <div className="stat-number">3 Roles</div>
              <div className="stat-label">Permission Levels</div>
            </div>
            <div className="stat">
              <div className="stat-number">Real-time</div>
              <div className="stat-label">Collaboration</div>
            </div>
          </div>
        </div>

        <div className="hero-illustration fade-in-up">
          <div className="dashboard-preview">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-card"></div>
              <div className="preview-card"></div>
              <div className="preview-card"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-label">Features</div>
        <h2>Everything You Need</h2>
        <p className="section-subtitle">Powerful tools designed for modern teams</p>

        <div className="features-grid">
          <div className="feature-card fade-in" style={{ transitionDelay: '0.1s' }}>
            <div className="feature-icon">📊</div>
            <h3>Dashboard</h3>
            <p>Get a complete overview of all your projects, tasks, and team progress at a glance.</p>
          </div>

          <div className="feature-card fade-in" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon">⬒</div>
            <h3>Project Management</h3>
            <p>Organize projects with color coding, member assignment, and progress tracking.</p>
          </div>

          <div className="feature-card fade-in" style={{ transitionDelay: '0.3s' }}>
            <div className="feature-icon">✓</div>
            <h3>Task Tracking</h3>
            <p>Create, assign, and track tasks with priority levels, due dates, and status updates.</p>
          </div>

          <div className="feature-card fade-in" style={{ transitionDelay: '0.4s' }}>
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Manage team members with role-based permissions and project-level access control.</p>
          </div>

          <div className="feature-card fade-in" style={{ transitionDelay: '0.5s' }}>
            <div className="feature-icon">📋</div>
            <h3>Kanban Board</h3>
            <p>Visualize workflow with drag-and-drop Kanban board for better task organization.</p>
          </div>

          <div className="feature-card fade-in" style={{ transitionDelay: '0.6s' }}>
            <div className="feature-icon">🔐</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security with JWT authentication, encrypted passwords, and role-based access.</p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="roles">
        <div className="section-label">Roles</div>
        <h2>Built for Every Team Member</h2>

        <div className="roles-grid">
          <div className="role-card">
            <div className="role-badge">👑</div>
            <h3>Admin</h3>
            <p className="role-desc">Full system access, user management, and complete project control.</p>
            <ul className="role-features">
              <li>✓ Manage all users</li>
              <li>✓ Create any project</li>
              <li>✓ View all tasks</li>
              <li>✓ Delete projects</li>
            </ul>
          </div>

          <div className="role-card">
            <div className="role-badge">📊</div>
            <h3>Manager</h3>
            <p className="role-desc">Manage your projects and coordinate team members effectively.</p>
            <ul className="role-features">
              <li>✓ Create projects</li>
              <li>✓ Assign team members</li>
              <li>✓ Update project tasks</li>
              <li>✓ Monitor progress</li>
            </ul>
          </div>

          <div className="role-card">
            <div className="role-badge">👤</div>
            <h3>Member</h3>
            <p className="role-desc">Collaborate on assigned projects and complete your tasks.</p>
            <ul className="role-features">
              <li>✓ View assigned projects</li>
              <li>✓ Update task status</li>
              <li>✓ Collaborate with team</li>
              <li>✓ Track progress</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="demo">
        <div className="demo-content">
          <div className="section-label">Try It Now</div>
          <h2>Test Drive TaskFlow</h2>
          <p>Sign in with any of these demo accounts to explore all features:</p>

          <div className="demo-accounts">
            <div className="account-box">
              <div className="account-role">👑 Admin</div>
              <div className="account-info">
                <input type="text" value="admin@demo.com" readOnly />
                <input type="text" value="admin123" readOnly />
              </div>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText('admin@demo.com');
                  navigator.clipboard.writeText('admin123');
                }}
              >
                Copy Credentials
              </button>
            </div>

            <div className="account-box">
              <div className="account-role">📊 Manager</div>
              <div className="account-info">
                <input type="text" value="jane@demo.com" readOnly />
                <input type="text" value="jane123" readOnly />
              </div>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText('jane@demo.com');
                  navigator.clipboard.writeText('jane123');
                }}
              >
                Copy Credentials
              </button>
            </div>

            <div className="account-box">
              <div className="account-role">👤 Member</div>
              <div className="account-info">
                <input type="text" value="maya@demo.com" readOnly />
                <input type="text" value="maya123" readOnly />
              </div>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText('maya@demo.com');
                  navigator.clipboard.writeText('maya123');
                }}
              >
                Copy Credentials
              </button>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginTop: '2rem' }}
          >
            Go to Login
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to streamline your team?</h2>
        <p>Join teams using TaskFlow to manage projects efficiently</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>TaskFlow</h4>
            <p>Modern project management for modern teams</p>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><a href="#features">Dashboard</a></li>
              <li><a href="#features">Projects</a></li>
              <li><a href="#features">Tasks</a></li>
              <li><a href="#features">Team</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Security</h4>
            <ul>
              <li><a href="#security">JWT Authentication</a></li>
              <li><a href="#security">Role-Based Access</a></li>
              <li><a href="#security">Data Encryption</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
