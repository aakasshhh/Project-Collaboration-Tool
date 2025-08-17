const { Schema: SchemaTask, model: modelTask } = require('mongoose');

const TASK_STATUS = ['todo', 'in_progress', 'completed'];

const taskSchema = new SchemaTask(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: TASK_STATUS, default: 'todo' },
    project: { type: SchemaTask.Types.ObjectId, ref: 'Project', required: true },
    assignedUsers: [{ type: SchemaTask.Types.ObjectId, ref: 'User' }],
    createdBy: { type: SchemaTask.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = modelTask('Task', taskSchema);
module.exports.TASK_STATUS = TASK_STATUS;
