const { Schema: SchemaP, model: modelP } = require('mongoose');

const projectSchema = new SchemaP(
  {
    name: { type: String, required: true },
    description: { type: String },
    team: { type: SchemaP.Types.ObjectId, ref: 'Team', required: true },
    createdBy: { type: SchemaP.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = modelP('Project', projectSchema);