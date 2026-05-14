const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

},
{
  timestamps: true,
}
);

userSchema.pre('save', async function(next) {

  if (!this.isModified('password'))
    return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.comparePassword = async function(candidate) {

  return await bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function() {

  const obj = this.toObject();

  delete obj.password;

  return obj;
};

module.exports = mongoose.model('User', userSchema);