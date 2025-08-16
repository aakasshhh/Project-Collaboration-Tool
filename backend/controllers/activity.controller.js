const Activity = require('../models/ActivityLog');

exports.listActivities = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};
    if (projectId) filter.project = projectId;
    const logs = await Activity.find(filter).sort('-createdAt').populate('user', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
