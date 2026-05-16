import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    lastSeen: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
