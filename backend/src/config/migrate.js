require('dotenv').config();
const pool = require('./db');

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
        color VARCHAR(20) DEFAULT '#4f8ef7',
        initials VARCHAR(5),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        color VARCHAR(20) DEFAULT '#4f8ef7',
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (project_id, user_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(300) NOT NULL,
        description TEXT,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
        priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        due_date DATE,
        tags TEXT[] DEFAULT '{}',
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
      $$ LANGUAGE plpgsql;
    `);

    for (const table of ['users', 'projects', 'tasks']) {
      await client.query(`
        DROP TRIGGER IF EXISTS set_updated_at_${table} ON ${table};
        CREATE TRIGGER set_updated_at_${table}
        BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      `);
    }

    // Seed demo data
    const bcrypt = require('bcryptjs');
    const adminExists = await client.query(`SELECT id FROM users WHERE email = 'admin@demo.com'`);

    if (adminExists.rows.length === 0) {
      console.log('🌱 Seeding demo data...');

      const adminPass = await bcrypt.hash('admin123', 10);
      const janePass = await bcrypt.hash('jane123', 10);
      const mayaPass = await bcrypt.hash('maya123', 10);
      const samPass = await bcrypt.hash('sam123', 10);

      const adminRes = await client.query(
        `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        ['Alex Admin', 'admin@demo.com', adminPass, 'admin', '#4f8ef7', 'AA']
      );
      const janeRes = await client.query(
        `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        ['Jane Manager', 'jane@demo.com', janePass, 'manager', '#f5a623', 'JM']
      );
      const mayaRes = await client.query(
        `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        ['Maya Patel', 'maya@demo.com', mayaPass, 'member', '#3dba7f', 'MP']
      );
      const samRes = await client.query(
        `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        ['Sam Lee', 'sam@demo.com', samPass, 'member', '#9b6dff', 'SL']
      );

      const adminId = adminRes.rows[0].id;
      const janeId = janeRes.rows[0].id;
      const mayaId = mayaRes.rows[0].id;
      const samId = samRes.rows[0].id;

      const p1Res = await client.query(
        `INSERT INTO projects (name, description, color, owner_id) VALUES ($1,$2,$3,$4) RETURNING id`,
        ['Website Redesign', 'Revamp the company website with modern design', '#4f8ef7', adminId]
      );
      const p2Res = await client.query(
        `INSERT INTO projects (name, description, color, owner_id) VALUES ($1,$2,$3,$4) RETURNING id`,
        ['Mobile App', 'Build cross-platform mobile application', '#9b6dff', adminId]
      );
      const p3Res = await client.query(
        `INSERT INTO projects (name, description, color, owner_id) VALUES ($1,$2,$3,$4) RETURNING id`,
        ['Team Task Manager', 'Assigning task to team', '#20c9c9', janeId]
      );
      const p4Res = await client.query(
        `INSERT INTO projects (name, description, color, owner_id) VALUES ($1,$2,$3,$4) RETURNING id`,
        ['Test Project', '', '#e05252', adminId]
      );

      const p1Id = p1Res.rows[0].id;
      const p2Id = p2Res.rows[0].id;
      const p3Id = p3Res.rows[0].id;
      const p4Id = p4Res.rows[0].id;

      await client.query(`INSERT INTO project_members VALUES ($1,$2),($1,$3),($1,$4)`, [p1Id, adminId, mayaId, samId]);
      await client.query(`INSERT INTO project_members VALUES ($1,$2),($1,$3)`, [p2Id, adminId, samId]);
      await client.query(`INSERT INTO project_members VALUES ($1,$2),($1,$3),($1,$4)`, [p3Id, janeId, mayaId, samId]);
      await client.query(`INSERT INTO project_members VALUES ($1,$2)`, [p4Id, adminId]);

      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 2);
      const pastDate = new Date(); pastDate.setDate(pastDate.getDate() - 3);
      const futureDate = new Date(); futureDate.setDate(futureDate.getDate() + 7);

      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Design homepage mockups', 'Create Figma mockups for all homepage sections', p1Id, mayaId, 'in-progress', 'high', tomorrow.toISOString().slice(0,10), ['design','ui'], adminId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Set up CI/CD pipeline', 'Configure GitHub Actions for automated deployments', p1Id, samId, 'todo', 'medium', futureDate.toISOString().slice(0,10), ['devops'], adminId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Write API documentation', 'Document all REST API endpoints with Swagger', p1Id, adminId, 'done', 'low', pastDate.toISOString().slice(0,10), ['docs'], adminId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['User authentication flow', 'Implement JWT auth with refresh tokens', p2Id, samId, 'in-progress', 'high', tomorrow.toISOString().slice(0,10), ['auth','backend'], adminId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Push notification setup', 'Integrate Firebase push notifications', p2Id, adminId, 'todo', 'medium', pastDate.toISOString().slice(0,10), ['mobile'], adminId]
      );
      // Manager's project tasks
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Setup project structure', 'Initialize project with basic components', p3Id, mayaId, 'done', 'high', tomorrow.toISOString().slice(0,10), ['setup'], janeId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Create task assignment feature', 'Allow managers to assign tasks to team members', p3Id, samId, 'done', 'high', futureDate.toISOString().slice(0,10), ['feature'], janeId]
      );
      await client.query(
        `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        ['Build dashboard', 'Create overview dashboard for project', p3Id, janeId, 'done', 'medium', tomorrow.toISOString().slice(0,10), ['ui','dashboard'], janeId]
      );

      console.log('✅ Demo data seeded');
    }

    console.log('✅ Migrations complete');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
