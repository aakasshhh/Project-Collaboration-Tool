const { Schema: SchemaA, model: modelA } = require('mongoose');

const activityLogSchema = new SchemaA(
  {
    action: { type: String, required: true },
    message: { type: String },
    user: { type: SchemaA.Types.ObjectId, ref: 'User', required: true },
    team: { type: SchemaA.Types.ObjectId, ref: 'Team' },
    project: { type: SchemaA.Types.ObjectId, ref: 'Project' },
    task: { type: SchemaA.Types.ObjectId, ref: 'Task' }
  },
  { timestamps: true }
);

module.exports = modelA('ActivityLog', activityLogSchema);
