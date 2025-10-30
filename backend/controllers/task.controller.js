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
      dueDate,
    });

    await ActivityL.create({
      action: 'task:create',
      message: `Task ${title} created`,
      user: req.user._id,
      project: projectId,
      task: task._id,
    });

    // Notify assigned users via email and socket
    if (assignedUsers.length > 0) {
      const users = await User.find({ _id: { $in: assignedUsers } });

      for (const u of users) {
        req.emailService
          .sendTaskAssignmentEmail(u.email, u.name, title, 'Project Name')
          .catch(() => {});
      }

      if (req.io) {
        emitToUsers(
          req.io,
          assignedUsers.map(String),
          'task:assigned',
          { taskId: task._id, title }
        );
      }
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
      task: task._id,
    });

    // Notify assigned users if status changed
    if (updates.status && updates.status !== before.status) {
      const assigned = task.assignedUsers.map(String);

      if (req.io) {
        emitToUsers(req.io, assigned, 'task:status_changed', {
          taskId: task._id,
          status: task.status,
        });
      }

      const users = await User.find({ _id: { $in: assigned } });
      for (const u of users) {
        req.emailService
          .sendTaskStatusUpdateEmail(u.email, u.name, task.title, task.status)
          .catch(() => {});
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
    const { identifiers = [] } = req.body; // can be emails or usernames

    if (!Array.isArray(identifiers) || identifiers.length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide at least one email or username' });
    }

    // Find users by email or username
    const users = await User.find({
      $or: [{ email: { $in: identifiers } }, { name: { $in: identifiers } }],
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No users found for the given identifiers',
      });
    }

    const userIds = users.map((u) => u._id);

    // Assign found users to the task
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $addToSet: { assignedUsers: { $each: userIds } } },
      { new: true }
    ).populate('assignedUsers', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Log the assignment
    await ActivityL.create({
      action: 'task:assign',
      message: `Assigned users to task`,
      user: req.user._id,
      project: task.project,
      task: task._id,
    });

    // Notify users
    for (const u of users) {
      req.emailService
        .sendTaskAssignmentEmail(u.email, u.name, task.title, 'Project Name')
        .catch(() => {});
    }

    if (req.io) {
      emitToUsers(req.io, userIds.map(String), 'task:assigned', {
        taskId: task._id,
        title: task.title,
      });
    }

    res.json({
      message: `Task assigned to ${users.map((u) => u.name).join(', ')}`,
      assignedUsers: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
      })),
      task,
    });
  } catch (err) {
    console.error('Error assigning users:', err);
    res.status(500).json({ message: 'Error assigning users' });
  }
};

exports.listTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).populate(
      'assignedUsers',
      'name email role'
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};