# ⬡ TaskFlow — Team Task Manager

TaskFlow is a modern, full-stack team task management application built with **React**, **Express**, and **PostgreSQL**. It features project organization, Kanban boards, role-based access control, and a sleek dark-themed UI.

## 🚀 Features

- **Project Management**: Create and organize projects with custom colors and team members.
- **Kanban Board**: Drag-and-drop-style status tracking (Todo, In Progress, Done).
- **Task Tracking**: Set priorities, due dates, and tags for every task.
- **Role-Based Access**: Admins can manage team members and projects; Members focus on their assigned tasks.
- **Real-time Stats**: Dashboard with overdue warnings and project progress tracking.
- **Modern UI**: Clean, responsive design with a premium dark mode aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Axios, React Router.
- **Backend**: Node.js, Express, PostgreSQL.
- **Auth**: JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Styling**: Vanilla CSS for maximum performance and customizability.

---

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or in the cloud)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TaskTeamManager.git
cd TaskTeamManager
```

### 2. Automatic Setup (Recommended)
We provide a setup script that installs dependencies and configures the database.
```bash
# On macOS/Linux
./setup.sh
```

### 3. Manual Setup

#### Backend Configuration
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file from the example: `cp .env.example .env`
4. Update `DATABASE_URL` in `.env` with your PostgreSQL credentials.
5. Run migrations to set up the schema: `npm run migrate`
6. Start the server: `npm start`

#### Frontend Configuration
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file: `echo "VITE_API_URL=http://localhost:5003/api" > .env`
4. Start the development server: `npm run dev`

---

## ☁️ Deployment on Railway

### 1. Database
- In your Railway dashboard, click **"New"** -> **"Database"** -> **"Add PostgreSQL"**.

### 2. Backend Service
- Click **"New"** -> **"GitHub Repo"** -> Select this repository.
- Go to **Settings** -> **Root Directory** and set it to `backend`.
- Go to **Variables** and add:
  - `DATABASE_URL`: (Railway will automatically link this if you created the DB in the same project).
  - `JWT_SECRET`: (A long random string).
  - `NODE_ENV`: `production`
- Railway will detect the `package.json` and start the server.

### 3. Frontend Service
- Click **"New"** -> **"GitHub Repo"** -> Select the same repository.
- Go to **Settings** -> **Root Directory** and set it to `frontend`.
- Go to **Variables** and add:
  - `VITE_API_URL`: The URL of your deployed backend service (e.g., `https://your-backend.up.railway.app/api`).
- Railway will build the static files and serve them.

---

## 📝 Demo Credentials
- **Admin**: `admin@demo.com` / `admin123`
- **Member**: `maya@demo.com` / `maya123`

## 📄 License
MIT
