const routerT = require('express').Router();
const authenticate = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');
const { createTeam, addMember, getMyTeams } = require('../controllers/team.controller');

routerT.post('/', authenticate, authorizeRoles('admin', 'manager'), createTeam);
routerT.post('/:teamId/members', authenticate, authorizeRoles('admin', 'manager'), addMember);
routerT.get('/mine', authenticate, getMyTeams);

module.exports = routerT;
