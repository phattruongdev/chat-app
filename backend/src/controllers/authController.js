import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  phone: user.phone,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) throw new HttpError(400, 'Name, email and password are required');
    if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new HttpError(409, 'Email is already registered');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new HttpError(400, 'Email and password are required');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new HttpError(401, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpError(401, 'Invalid email or password');

    const token = signToken(user._id);
    user.password = undefined;

    res.json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, avatar, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) throw new HttpError(404, 'User not found');

    if (name !== undefined) {
      if (!name.trim() || name.trim().length < 2) throw new HttpError(400, 'Name must be at least 2 characters');
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) throw new HttpError(400, 'Email is required');
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (existingUser) throw new HttpError(409, 'Email is already registered');
      user.email = normalizedEmail;
    }

    if (phone !== undefined) {
      const normalizedPhone = phone.trim();
      if (normalizedPhone && !/^[0-9+\-\s()]{8,20}$/.test(normalizedPhone)) {
        throw new HttpError(400, 'Phone number format is invalid');
      }
      user.phone = normalizedPhone;
    }

    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) throw new HttpError(400, 'New password must be at least 6 characters');
      if (!currentPassword) throw new HttpError(400, 'Current password is required to change password');

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) throw new HttpError(401, 'Current password is incorrect');

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
