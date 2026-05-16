import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) throw new HttpError(401, 'Authentication token is required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) throw new HttpError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, 'Invalid or expired token'));
  }
};
