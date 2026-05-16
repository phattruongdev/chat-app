import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    lastSeen: { type: Date, default: null }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
