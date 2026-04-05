
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Analyst', 'Viewer'], 
    default: 'Viewer' 
  }
}, { timestamps: true });

// Middleware: Hash password before saving to DB
// Middleware: Hash password before saving to DB
userSchema.pre('save', async function () {
  // If password isn't modified, just exit the function
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // No next() call needed when using an async function
});
// Method: Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);