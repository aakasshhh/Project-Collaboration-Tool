const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['admin', 'manager', 'member'];

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'member' },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = model('User', userSchema);
module.exports.ROLES = ROLES;