const pool = require('../config/db');

const taskQuery = `
  SELECT t.*,
    jsonb_build_object('id', a.id, 'name', a.name, 'color', a.color, 'initials', a.initials) as assignee,
    jsonb_build_object('id', p.id, 'name', p.name, 'color', p.color) as project
  FROM tasks t
  LEFT JOIN users a ON t.assignee_id = a.id
  JOIN projects p ON t.project_id = p.id
`;

exports.getByProject = async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;
    let where = `WHERE t.project_id = $1`;
    const params = [req.params.projectId];
    let i = 2;
    if (status) { where += ` AND t.status = $${i++}`; params.push(status); }
    if (priority) { where += ` AND t.priority = $${i++}`; params.push(priority); }
    if (assignee) { where += ` AND t.assignee_id = $${i++}`; params.push(assignee); }

    const result = await pool.query(`${taskQuery} ${where} ORDER BY t.created_at DESC`, params);
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `${taskQuery} WHERE t.assignee_id = $1 ORDER BY t.due_date ASC NULLS LAST, t.created_at DESC`,
      [req.user.id]
    );
    res.json({ tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager';

    let statsQuery, baseQuery;
    let params = [];
    
    if (isAdmin) {
      baseQuery = taskQuery;
      statsQuery = `SELECT
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
           COUNT(*) FILTER (WHERE status = 'done') as done,
           COUNT(*) FILTER (WHERE status != 'done' AND due_date < CURRENT_DATE) as overdue
         FROM tasks`;
    } else if (isManager) {
      // Managers see tasks from their projects
      baseQuery = taskQuery + ` WHERE t.project_id IN (SELECT id FROM projects WHERE owner_id = $1)`;
      statsQuery = `SELECT
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
           COUNT(*) FILTER (WHERE status = 'done') as done,
           COUNT(*) FILTER (WHERE status != 'done' AND due_date < CURRENT_DATE) as overdue
         FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE owner_id = $1)`;
      params = [userId];
    } else {
      // Members see only their assigned tasks
      baseQuery = taskQuery + ` WHERE t.assignee_id = $1`;
      statsQuery = `SELECT
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
           COUNT(*) FILTER (WHERE status = 'done') as done,
           COUNT(*) FILTER (WHERE status != 'done' AND due_date < CURRENT_DATE) as overdue
         FROM tasks WHERE assignee_id = $1`;
      params = [userId];
    }

    const [statsRes, recentRes, overdueRes] = await Promise.all([
      pool.query(statsQuery, params),
      pool.query(`${baseQuery} ORDER BY t.created_at DESC LIMIT 5`, params),
      pool.query(`${baseQuery} AND t.status != 'done' AND t.due_date < CURRENT_DATE ORDER BY t.due_date ASC LIMIT 5`, params),
    ]);

    res.json({
      stats: statsRes.rows[0],
      recent_tasks: recentRes.rows,
      overdue_tasks: overdueRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

exports.create = async (req, res) => {
  const { title, description, project_id, assignee_id, status = 'todo', priority = 'medium', due_date, tags = [] } = req.body;
  try {
    // Verify project access
    const access = await pool.query(
      `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2`,
      [project_id, req.user.id]
    );
    if (!access.rows.length && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No access to this project' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, project_id, assignee_id, status, priority, due_date, tags, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [title, description, project_id, assignee_id || null, status, priority, due_date || null, tags, req.user.id]
    );

    const task = await pool.query(`${taskQuery} WHERE t.id = $1`, [result.rows[0].id]);
    res.status(201).json({ task: task.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.update = async (req, res) => {
  const { title, description, assignee_id, status, priority, due_date, tags } = req.body;
  try {
    const existing = await pool.query('SELECT t.*, p.owner_id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1', [req.params.taskId]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Task not found' });

    const t = existing.rows[0];
    // Check authorization
    if (req.user.role === 'admin') {
      // Admins can update any task
    } else if (req.user.role === 'manager') {
      // Managers can update tasks in projects they own
      if (t.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'Cannot edit tasks in other managers\' projects' });
      }
    } else {
      // Members can ONLY update their own assigned tasks
      if (t.assignee_id !== req.user.id) {
        return res.status(403).json({ error: 'Cannot edit this task - you must be the assignee' });
      }
    }

    const result = await pool.query(
      `UPDATE tasks SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        assignee_id = COALESCE($3, assignee_id),
        status = COALESCE($4, status),
        priority = COALESCE($5, priority),
        due_date = COALESCE($6, due_date),
        tags = COALESCE($7, tags)
       WHERE id = $8 RETURNING id`,
      [title, description, assignee_id, status, priority, due_date, tags, req.params.taskId]
    );

    const task = await pool.query(`${taskQuery} WHERE t.id = $1`, [result.rows[0].id]);
    res.json({ task: task.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.remove = async (req, res) => {
  try {
    // First fetch the task to verify it exists and check authorization
    const taskCheck = await pool.query(
      'SELECT t.*, p.owner_id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1',
      [req.params.taskId]
    );
    if (!taskCheck.rows.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const t = taskCheck.rows[0];
    
    // Check authorization
    if (req.user.role === 'admin') {
      // Admins can delete any task
    } else if (req.user.role === 'manager') {
      // Managers can only delete tasks in projects they own
      if (t.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'Cannot delete tasks in other managers\' projects' });
      }
    } else {
      // Members can only delete tasks they created, NOT assigned ones
      if (t.created_by !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete tasks you created' });
      }
    }
    
    let query = `DELETE FROM tasks WHERE id = $1`;
    let params = [req.params.taskId];
    
    query += ` RETURNING id`;
    const result = await pool.query(query, params);
    if (!result.rows.length) return res.status(404).json({ error: 'Task not found or unauthorized' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
