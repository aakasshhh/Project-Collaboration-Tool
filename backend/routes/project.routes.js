const routerP = require('express').Router();
const authenticateP = require('../middleware/auth');
const { authorizeRoles: authRolesP } = require('../middleware/roles');
const { createProject, getProjectsByTeam } = require('../controllers/project.controller');

routerP.post('/', authenticateP, authRolesP('admin', 'manager'), createProject);
routerP.get('/team/:teamId', authenticateP, getProjectsByTeam);

module.exports = routerP;