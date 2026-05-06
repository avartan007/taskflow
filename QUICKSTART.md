# 🚀 TaskFlow - Quick Start Guide

## ⚡ Get Running in 30 Seconds

### 1. Install Dependencies (One Time)
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Setup Database (One Time)
```bash
# Create database
createdb taskflow

# Run migrations
npm run migrate
```

### 3. Start Development
```bash
npm run dev
```

Done! 🎉 Open **http://localhost:3000**

---

## 📝 Test Accounts

Use any of these to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo123 |
| Manager | jane@demo.com | demo123 |
| Member | maya@demo.com | demo123 |

---

## 🔧 Manual Terminal Setup (if needed)

Open **2 terminals** in the project folder:

**Terminal 1 - Backend:**
```bash
npm run backend
# Runs on http://localhost:5003
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 📤 Push to GitHub

```bash
# First time setup
git remote add origin https://github.com/YOUR_USERNAME/task-team-manager.git
git branch -M main

# Push your code
git push -u origin main

# Future pushes
git push origin main
```

---

## 📋 Useful Commands

```bash
# View git commits
git log --oneline

# Check git status
git status

# Build frontend for production
cd frontend && npm run build

# View database migrations
npm run migrate

# Stop running servers
# Press Ctrl+C in the terminal
```

---

## 🚀 Deploy to Railway

1. Create account at https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub repository
4. Railway auto-detects and deploys!

See **DEPLOYMENT.md** for detailed instructions.

---

## ❓ Troubleshooting

### Error: "concurrently: command not found"
```bash
npm install
```

### Error: "database does not exist"
```bash
createdb taskflow
npm run migrate
```

### Port 3000 or 5003 already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5003
lsof -ti:5003 | xargs kill -9
```

### Frontend not loading data?
- Check backend is running on Terminal 1
- Verify database is created: `createdb taskflow`
- Run migrations: `npm run migrate`

---

## 📚 Full Documentation

- **DEPLOYMENT.md** - Deploy to Railway & GitHub
- **SECURITY_AUDIT.md** - Security information
- **CHANGELOG.md** - What's new
- **README.md** - Full project details

---

**Having issues?** Check the commands above or open an issue on GitHub! ✨
