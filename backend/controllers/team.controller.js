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
    const { identifiers = [] } = req.body;

    if (!Array.isArray(identifiers) || identifiers.length === 0) {
      return res
        .status(400)
        .json({ message: 'Please provide at least one email or username' });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const users = await UserModel.find({
      $or: [
        { email: { $in: identifiers } },
        { name: { $in: identifiers } }
      ]
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: 'No matching users found for given identifiers' });
    }

    const userIds = users.map((u) => u._id);

    for (const id of userIds) {
      if (!team.members.includes(id)) {
        team.members.push(id);
        await UserModel.findByIdAndUpdate(id, { $addToSet: { teams: teamId } });
      }
    }

    await team.save();

    await ActivityLog.create({
      action: 'team:add_member',
      message: `Added ${users.map((u) => u.name).join(', ')} to team`,
      user: req.user._id,
      team: teamId
    });

    for (const u of users) {
      req.emailService
        .sendTeamJoinNotification(u.email, u.name, team.name)
        .catch(() => {});
    }

    res.json({
      message: `Added ${users.map((u) => u.name).join(', ')} to the team successfully!`,
      addedMembers: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email
      })),
      team
    });
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ message: 'Error adding member' });
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
