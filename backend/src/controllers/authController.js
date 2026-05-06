const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const COLORS = ['#4f8ef7', '#9b6dff', '#3dba7f', '#f5a623', '#e05252', '#20c9c9', '#f06292', '#ff8a65'];

exports.register = async (req, res) => {
  const { name, email, password, role = 'member' } = req.body;
  try {
    // Only allow 'member' role on self-registration (prevent self-promotion)
    if (role !== 'member') {
      return res.status(400).json({ error: 'Invalid role. Contact an admin to set your role.' });
    }
    
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, color, initials) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, email, role, color, initials, created_at`,
      [name, email, hashed, 'member', color, initials]
    );
    const user = result.rows[0];
    res.status(201).json({ token: generateToken(user.id), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, name, email, password, role, color, initials FROM users WHERE email = $1',
      [email]
    );
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...userWithoutPass } = user;
    res.json({ token: generateToken(user.id), user: userWithoutPass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
