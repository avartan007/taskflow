# TaskFlow - Full Stack Deployment Guide

## Overview
TaskFlow is a full-stack task management application with React frontend and Node.js/Express backend. This guide covers deployment on Railway.

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Node.js 18+ locally (for development)

## Local Development Setup

### 1. Environment Variables

#### Backend (.env in root)
```
NODE_ENV=development
PORT=5003
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow
JWT_SECRET=your-secret-key-here-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env in frontend/)
```
VITE_API_URL=http://localhost:5003/api
```

### 2. Install Dependencies
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Database Setup
```bash
# Create database
createdb taskflow

# Run migrations
node migrate.js
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Production Deployment on Railway (Recommended)

Since this is a monorepo, the easiest way to deploy on Railway is to create **two separate services** from your single GitHub repository.

### 1. Push to GitHub
If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit: TaskFlow full-stack app"
# Create a repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend Service
1. Go to **Railway.app** and click "New Project" -> "Deploy from GitHub".
2. Select your `taskflow` repository.
3. Once the service is created, go to **Settings** -> **General** -> **Root Directory** and set it to `/backend`.
4. Go to **Variables** and add:
   - `PORT`: `5003`
   - `JWT_SECRET`: (Any long random string)
   - `CORS_ORIGIN`: (Leave blank for now, add your frontend URL later)
   - `NODE_ENV`: `production`
5. Click **New** -> **Database** -> **PostgreSQL**. Railway will automatically link this to your backend service.
6. **Deployment Command**: Ensure it runs migrations. Set the "Build Command" or "Start Command" in Settings to: `node src/config/migrate.js && npm start`

### 3. Deploy Frontend Service
1. In the same Railway project, click **New** -> **GitHub Repo**.
2. Select the **same** `taskflow` repository again.
3. Go to **Settings** -> **General** -> **Root Directory** and set it to `/frontend`.
4. Go to **Variables** and add:
   - `VITE_API_URL`: (The "Public Networking" URL of your Backend Service + `/api`)
     - *Example: `https://taskflow-backend.up.railway.app/api`*
5. Railway will automatically detect it as a Vite app and run `npm run build`.

### 4. Final Connection
1. Copy the URL of your **Frontend** service.
2. Go back to your **Backend** service variables and update `CORS_ORIGIN` with that URL.
3. Redeploy the Backend.

### 4. Database Migration in Production
1. In Railway Dashboard, go to Backend service
2. In the "Deployments" tab, find deployment shell access
3. Run: `node migrate.js`

Or configure automatic migration in package.json:
```json
{
  "scripts": {
    "start": "node migrate.js && node index.js",
    "dev": "nodemon index.js"
  }
}
```

### 5. Configure Domains

**Backend**:
- Railway assigns auto domain (e.g., `task-team-manager-prod.up.railway.app`)
- Set `CORS_ORIGIN` to your frontend URL

**Frontend**:
- Railway assigns auto domain
- Update `VITE_API_URL` in environment variables

### 6. GitHub Actions CI/CD

The `.github/workflows/deploy.yml` file enables automatic deployment on push to main:

1. Get Railway token from Railway Dashboard → Account Settings → API Tokens
2. Add to GitHub repo → Settings → Secrets and variables → Actions
3. Add secret: `RAILWAY_TOKEN=<your-token>`

Now every push to main will automatically deploy!

## Monitoring & Logs

- Access logs in Railway Dashboard → Service → Logs tab
- Monitor database in PostgreSQL plugin dashboard
- Check deployment status and rollback if needed

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format: `postgresql://user:password@host:port/dbname`
- Check Railway PostgreSQL plugin is linked to backend service

### CORS Errors
- Ensure `CORS_ORIGIN` matches your frontend domain exactly
- Frontend must include credentials in API requests if needed

### Frontend Not Loading API
- Verify `VITE_API_URL` points to correct backend domain
- Rebuild frontend: `npm run build` in frontend directory
- Redeploy frontend service in Railway

### Build Failures
- Check logs in Railway Dashboard
- Ensure all environment variables are set
- Verify database migrations run successfully

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project
- `GET /api/users` - Get team members

## Demo Credentials

Test accounts for development/staging:

1. **Admin Account**
   - Email: `admin@demo.com`
   - Password: `demo123`
   - Role: Administrator

2. **Manager Account**
   - Email: `jane@demo.com`
   - Password: `demo123`
   - Role: Manager

3. **Member Account**
   - Email: `maya@demo.com`
   - Password: `demo123`
   - Role: Member

## Security Considerations

1. **Never commit .env files**
2. **Use strong JWT_SECRET** (min 32 characters)
3. **Enable HTTPS** (Railway provides SSL by default)
4. **Validate all inputs** on backend
5. **Use environment variables** for sensitive data
6. **Regular security audits** - see SECURITY_AUDIT.md for known issues

## Performance Tips

1. Enable database connection pooling
2. Use Redis for caching (optional, add to Railway)
3. Optimize frontend bundle size
4. Configure CDN for static assets

## Support

For issues or questions:
1. Check Railway documentation: https://docs.railway.app
2. Review SECURITY_AUDIT.md for known vulnerabilities
3. Check application logs in Railway Dashboard
