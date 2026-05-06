const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const COLORS = ['#5B4636', '#4B2E19', '#B49A83', '#7E3E28', '#2C3E50', '#5E6253', '#5A3D55', '#A49C92'];

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
    console.log('Login attempt for:', email);
    const result = await pool.query(
      'SELECT id, name, email, password, role, color, initials FROM users WHERE email = $1',
      [email]
    );
    
    if (!result.rows.length) {
      console.log('Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      console.log('Login failed: Incorrect password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login success for:', email);
    const { password: _, ...userWithoutPass } = user;
    res.json({ token: generateToken(user.id), user: userWithoutPass });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
