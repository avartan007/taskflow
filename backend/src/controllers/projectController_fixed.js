const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    let query, params;
    
    if (req.user.role === 'admin') {
      query = `SELECT p.id, p.name, p.description, p.color, p.owner_id, p.created_at, p.updated_at, u.name as owner_name,
               COALESCE(json_agg(DISTINCT pm.user_id) FILTER (WHERE pm.user_id IS NOT NULL), '[]') as member_ids
             FROM projects p
             JOIN users u ON p.owner_id = u.id
             LEFT JOIN project_members pm ON p.id = pm.project_id
             GROUP BY p.id, u.id
             ORDER BY p.created_at DESC`;
      params = [];
    } else {
      query = `SELECT p.id, p.name, p.description, p.color, p.owner_id, p.created_at, p.updated_at, u.name as owner_name,
               COALESCE(json_agg(DISTINCT pm.user_id) FILTER (WHERE pm.user_id IS NOT NULL), '[]') as member_ids
             FROM projects p
             JOIN users u ON p.owner_id = u.id
             JOIN project_members pm ON p.id = pm.project_id
             WHERE pm.user_id = $1
             GROUP BY p.id, u.id
             ORDER BY p.created_at DESC`;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);
    res.json({ projects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.description, p.color, p.owner_id, p.created_at, p.updated_at, u.name as owner_name,
         COALESCE(json_agg(DISTINCT jsonb_build_object('id', usr.id, 'name', usr.name, 'email', usr.email, 'role', usr.role, 'color', usr.color, 'initials', usr.initials)) FILTER (WHERE usr.id IS NOT NULL), '[]') as members
       FROM projects p
       JOIN users u ON p.owner_id = u.id
       LEFT JOIN project_members pm ON p.id = pm.project_id
       LEFT JOIN users usr ON pm.user_id = usr.id
       WHERE p.id = $1
       GROUP BY p.id, u.id`,
      [req.params.projectId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Project not found' });
    res.json({ project: result.rows[0] });
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
