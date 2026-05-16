import User from '../models/User.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password').sort({ name: 1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
