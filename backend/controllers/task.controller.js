const Task = require('../models/Task');
const ActivityL = require('../models/ActivityLog');
const User = require('../models/User');
const { emitToUsers } = require('../utils/socket');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedUsers = [], dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedUsers,
      createdBy: req.user._id,
      dueDate
    });

    await ActivityL.create({
      action: 'task:create',
      message: `Task ${title} created`,
      user: req.user._id,
      project: projectId,
      task: task._id
    });

    
    const users = await User.find({ _id: { $in: assignedUsers } });
    for (const u of users) {
      req.emailService.sendTaskAssignmentEmail(u.email, u.name, title, 'Project Name').catch(() => {});
    }

    if (req.io) {
      emitToUsers(req.io, assignedUsers.map(String), 'task:assigned', { taskId: task._id, title });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const before = await Task.findById(taskId);
    if (!before) return res.status(404).json({ message: 'Task not found' });

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    await ActivityL.create({
      action: 'task:update',
      message: `Task updated`,
      user: req.user._id,
      project: task.project,
      task: task._id
    });

    
    if (updates.status && updates.status !== before.status) {
      const assigned = task.assignedUsers.map(String);

      if (req.io) {
        emitToUsers(req.io, assigned, 'task:status_changed', { taskId: task._id, status: task.status });
      }

      const users = await User.find({ _id: { $in: assigned } });
      for (const u of users) {
        req.emailService.sendTaskStatusUpdateEmail(u.email, u.name, task.title, task.status).catch(() => {});
      }
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignUsers = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userIds = [] } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assignedUsers: { $each: userIds } } },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await ActivityL.create({
      action: 'task:assign',
      message: `Assigned users to task`,
      user: req.user._id,
      project: task.project,
      task: task._id
    });

    const users = await User.find({ _id: { $in: userIds } });
    for (const u of users) {
      req.emailService.sendTaskAssignmentEmail(u.email, u.name, task.title, 'Project Name').catch(() => {});
    }

    if (req.io) {
      emitToUsers(req.io, userIds.map(String), 'task:assigned', { taskId: task._id, title: task.title });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).populate('assignedUsers', 'name email role');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
