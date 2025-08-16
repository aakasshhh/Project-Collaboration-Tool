const { Schema: SchemaT, model: modelT } = require('mongoose');

const teamSchema = new SchemaT(
  {
    name: { type: String, required: true },
    createdBy: { type: SchemaT.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: SchemaT.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

module.exports = modelT('Team', teamSchema);
