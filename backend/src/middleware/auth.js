const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, name, email, role, color, initials FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (!result.rows.length) return res.status(401).json({ error: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireManager = (req, res, next) => {
  if (req.user?.role !== 'manager' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Manager access required' });
  }
  next();
};

const requireManagerOrAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'manager' && role !== 'admin') {
    return res.status(403).json({ error: 'Manager or Admin access required' });
  }
  next();
};

const requireProjectAccess = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.project_id;
  if (!projectId || projectId === 'undefined') {
    return next();
  }

  try {
    const result = await pool.query(
      `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2`,
      [projectId, req.user.id]
    );
    if (!result.rows.length && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied to this project' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { authenticate, requireAdmin, requireManager, requireManagerOrAdmin, requireProjectAccess };
