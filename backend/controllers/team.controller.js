const Team = require('../models/Team');
const UserModel = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const team = await Team.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await ActivityLog.create({
      action: 'team:create',
      message: `Team ${name} created`,
      user: req.user._id,
      team: team._id
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    await UserModel.findByIdAndUpdate(userId, { $addToSet: { teams: teamId } });

    await ActivityLog.create({
      action: 'team:add_member',
      message: `Added user ${userId} to team`,
      user: req.user._id,
      team: teamId
    });

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id }).populate(
      'members',
      'name email'
    );
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
