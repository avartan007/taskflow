const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const projectCtrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');
const userCtrl = require('../controllers/userController');
const { authenticate, requireAdmin, requireManagerOrAdmin, requireProjectAccess } = require('../middleware/auth');
const { validateRegister, validateLogin, validateProject, validateTask } = require('../middleware/validate');

// Auth
router.post('/auth/register', validateRegister, authCtrl.register);
router.post('/auth/login', validateLogin, authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.me);

// Dashboard
router.get('/dashboard', authenticate, taskCtrl.getDashboard);

// Projects - Managers and Admins can create projects
router.get('/projects', authenticate, projectCtrl.getAll);
router.post('/projects', authenticate, requireManagerOrAdmin, validateProject, projectCtrl.create);
router.get('/projects/:projectId', authenticate, requireProjectAccess, projectCtrl.getOne);
router.put('/projects/:projectId', authenticate, requireManagerOrAdmin, validateProject, projectCtrl.update);
router.delete('/projects/:projectId', authenticate, requireManagerOrAdmin, projectCtrl.remove);
router.get('/projects/:projectId/stats', authenticate, requireProjectAccess, projectCtrl.getStats);

// Tasks
router.get('/projects/:projectId/tasks', authenticate, requireProjectAccess, taskCtrl.getByProject);
router.post('/tasks', authenticate, validateTask, taskCtrl.create);
router.put('/tasks/:taskId', authenticate, taskCtrl.update);
router.delete('/tasks/:taskId', authenticate, taskCtrl.remove);
router.get('/tasks/me', authenticate, taskCtrl.getMyTasks);

// Users (admin only for most)
router.get('/users', authenticate, userCtrl.getAll);
router.post('/users', authenticate, requireAdmin, userCtrl.create);
router.get('/users/:userId', authenticate, userCtrl.getOne);
router.put('/users/:userId', authenticate, userCtrl.update);
router.delete('/users/:userId', authenticate, requireAdmin, userCtrl.remove);

module.exports = router;
