const Project = require('../models/Project');
const Activity = require('../models/ActivityLog');

exports.createProject =  async (req, res) => {
  try {
    const { name, description, teamId } = req.body;
    const project = await Project.create({
      name,
      description,
      team: teamId,
      createdBy: req.user._id
    });

    await Activity.create({
      action: 'project:create',
      message: `Project ${name} created`,
      user: req.user._id,
      team: teamId,
      project: project._id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const projects = await Project.find({ team: teamId }).sort('-createdAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
