const routerAct = require('express').Router();
const authenticateAct = require('../middleware/auth');
const { listActivities } = require('../controllers/activity.controller');

routerAct.get('/', authenticateAct, listActivities);

module.exports = routerAct;
