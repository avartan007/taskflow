# 🎯 TaskFlow — Team Task Manager

A professional, full-stack team task management application with a **modern landing page**, **beautiful UI**, and **production-ready deployment**.

Built with **React 18**, **Express.js**, and **PostgreSQL** • Deployed on **Railway** • Secured with **JWT Auth**

---

## ⚡ Quick Start (30 seconds)

```bash
npm install && cd frontend && npm install && cd ..
npm run dev
# Open http://localhost:3000
```

**👉 See [QUICKSTART.md](./QUICKSTART.md) for detailed setup & test accounts**

---

## ✨ Features

- **📱 Professional Landing Page** - Beautiful intro with animations and demo credentials
- **📊 Project Management** - Create and organize projects with team collaboration
- **🎯 Task Tracking** - Kanban board with priorities, due dates, and team members  
- **👥 Role-Based Access** - Admin, Manager, Member roles with fine-grained permissions
- **🎨 Modern Dark Theme** - Purple/Teal gradient design with smooth animations
- **📈 Real-time Dashboard** - Project stats, progress tracking, and overdue warnings
- **🔐 Secure Authentication** - JWT tokens with bcrypt password hashing
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 • Vite • React Router • Axios • CSS3 Animations |
| **Backend** | Node.js • Express.js • PostgreSQL • JWT Auth • Bcrypt |
| **Deployment** | Railway • GitHub Actions • Docker |
| **Security** | JWT Tokens • Role-Based Access Control • Input Validation |

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Projects  
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project

### Users
- `GET /api/users` - Get team members

---

## 🚀 Setup & Deployment

### Local Development

#### Prerequisites
- Node.js 18+
- PostgreSQL 12+

#### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/task-team-manager.git
cd task-team-manager
npm install && cd frontend && npm install && cd ..
```

#### 2. Database Setup
```bash
createdb taskflow
npm run migrate
```

#### 3. Start Dev Servers
```bash
npm run dev
```

Open **http://localhost:3000** ✨

---

### Deploy to Railway

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide**

#### Quick Deploy:
1. Push to GitHub
2. Create Railway project
3. Connect GitHub repo
4. Railway auto-deploys!

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Fast setup & useful commands |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Railway deployment guide |
| [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) | Security info & vulnerabilities |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## 🧪 Test Accounts

Login with these credentials to explore all features:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@demo.com | demo123 |
| **Manager** | jane@demo.com | demo123 |
| **Member** | maya@demo.com | demo123 |

Each role has different permissions. Start with Admin to explore everything!

---

## 🐛 Troubleshooting

### "concurrently: command not found"
```bash
npm install
```

### "database does not exist"
```bash
createdb taskflow
npm run migrate
```

### Port 3000 or 5003 already in use?
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:5003 | xargs kill -9
```

### Frontend not connecting to backend?
- Backend should be running on `http://localhost:5003`
- Check `.env` in frontend has: `VITE_API_URL=http://localhost:5003/api`

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues or pull requests.

---

## 📜 License

MIT License - Feel free to use for personal or commercial projects.

---

## 🙋 Support

- **Questions?** Check [QUICKSTART.md](./QUICKSTART.md)
- **Setup issues?** See Troubleshooting above
- **Security concerns?** Check [SECURITY_AUDIT.md](./SECURITY_AUDIT.md)
- **Deployment help?** See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Built with ❤️ • Ready for production • Let's manage tasks! 🚀**
