const routerTask = require('express').Router();
const authenticateTask = require('../middleware/auth');
const { authorizeRoles: authRolesTask } = require('../middleware/roles');
const { createTask, updateTask, assignUsers, listTasksByProject } = require('../controllers/task.controller');

routerTask.post('/', authenticateTask, authRolesTask('admin', 'manager'), createTask);
routerTask.patch('/:taskId', authenticateTask, updateTask);
routerTask.post('/:taskId/assign', authenticateTask, authRolesTask('admin', 'manager'), assignUsers);
routerTask.get('/project/:projectId', authenticateTask, listTasksByProject);

module.exports = routerTask;
