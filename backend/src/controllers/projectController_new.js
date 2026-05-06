const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query(
        `SELECT p.*, u.name as owner_name FROM projects p JOIN users u ON p.owner_id = u.id ORDER BY p.created_at DESC`
      );
      res.json({ projects: result.rows });
    } else {
      const result = await pool.query(
        `SELECT p.*, u.name as owner_name FROM projects p 
         JOIN users u ON p.owner_id = u.id 
         WHERE EXISTS(SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = $1)
         ORDER BY p.created_at DESC`,
        [req.user.id]
      );
      res.json({ projects: result.rows });
    }
  } catch (err) {
    console.error('Error in getAll:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const projectRes = await pool.query(
      `SELECT p.*, u.name as owner_name FROM projects p JOIN users u ON p.owner_id = u.id WHERE p.id = $1`,
      [req.params.projectId]
    );
    
    if (!projectRes.rows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = projectRes.rows[0];
    
    const membersRes = await pool.query(
      `SELECT usr.id, usr.name, usr.email, usr.role, usr.color, usr.initials FROM users usr
       JOIN project_members pm ON pm.user_id = usr.id WHERE pm.project_id = $1`,
      [req.params.projectId]
    );
    
    project.members = membersRes.rows;
    
    res.json({ project });
  } catch (err) {
    console.error('Error in getOne:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.create = async (req, res) => {
  const { name, description, color = '#4f8ef7', member_ids = [] } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO projects (name, description, color, owner_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, description, color, req.user.id]
    );
    const project = result.rows[0];

    const allMembers = [...new Set([req.user.id, ...member_ids])];
    for (const uid of allMembers) {
      await client.query(
        `INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [project.id, uid]
      );
    }
    await client.query('COMMIT');

    project.member_ids = allMembers;
    res.status(201).json({ project });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in create:', err);
    res.status(500).json({ error: 'Failed to create project' });
  } finally {
    client.release();
  }
};

exports.update = async (req, res) => {
  const { name, description, color, member_ids } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE projects SET name=COALESCE($1,name), description=COALESCE($2,description), color=COALESCE($3,color) WHERE id=$4 RETURNING *`,
      [name, description, color, req.params.projectId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Project not found' });

    if (member_ids) {
      await client.query(`DELETE FROM project_members WHERE project_id = $1`, [req.params.projectId]);
      const allMembers = [...new Set([req.user.id, ...member_ids])];
      for (const uid of allMembers) {
        await client.query(`INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [req.params.projectId, uid]);
      }
    }
    await client.query('COMMIT');
    res.json({ project: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in update:', err);
    res.status(500).json({ error: 'Failed to update project' });
  } finally {
    client.release();
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING id`, [req.params.projectId, req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Project not found or unauthorized' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Error in remove:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'todo') as todo,
         COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
         COUNT(*) FILTER (WHERE status = 'done') as done,
         COUNT(*) FILTER (WHERE status != 'done' AND due_date < CURRENT_DATE) as overdue
       FROM tasks WHERE project_id = $1`,
      [req.params.projectId]
    );
    res.json({ stats: result.rows[0] });
  } catch (err) {
    console.error('Error in getStats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
