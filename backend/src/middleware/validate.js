const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'member']).withMessage('Role must be admin or member'),
  handleValidation,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const validateProject = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 200 }),
  body('description').optional().trim(),
  body('color').optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage('Invalid color'),
  body('member_ids').optional().isArray(),
  handleValidation,
];

const validateTask = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 300 }),
  body('project_id').isUUID().withMessage('Valid project ID required'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('due_date').trim().optional({ checkFalsy: true }).isISO8601().withMessage('Invalid date format'),
  handleValidation,
];

module.exports = { validateRegister, validateLogin, validateProject, validateTask };
