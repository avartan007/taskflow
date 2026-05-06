const bcrypt = require('bcryptjs');
const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, color, initials, created_at FROM users ORDER BY name`
    );
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, color, initials, created_at FROM users WHERE id = $1`,
      [req.params.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.create = async (req, res) => {
  const { name, email, password, role = 'member' } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#4f8ef7', '#9b6dff', '#3dba7f', '#f5a623', '#e05252', '#20c9c9'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name, email, role, color, initials, created_at`,
      [name, email, hashed, role, color, initials]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.update = async (req, res) => {
  const { name, role, color } = req.body;
  // Only allow self-update or admin update
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // Only admin can change roles
  const safeRole = req.user.role === 'admin' ? role : undefined;

  try {
    const initials = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : undefined;
    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        color = COALESCE($3, color),
        initials = COALESCE($4, initials)
       WHERE id = $5 RETURNING id, name, email, role, color, initials`,
      [name, safeRole, color, initials, req.params.userId]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.remove = async (req, res) => {
  if (req.params.userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.userId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
