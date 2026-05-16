import Message from '../models/Message.js';
import User from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const otherUser = await User.findById(userId).select('-password');
    if (!otherUser) throw new HttpError(404, 'Chat user not found');

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .populate('sender receiver', 'name email avatar lastSeen')
      .sort({ createdAt: 1 });

    res.json({ success: true, user: otherUser, messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text?.trim()) throw new HttpError(400, 'Receiver and text are required');

    const receiver = await User.findById(receiverId);
    if (!receiver) throw new HttpError(404, 'Receiver not found');

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim()
    });

    const populated = await message.populate('sender receiver', 'name email avatar lastSeen');

    req.io?.to(receiverId.toString()).emit('message:new', populated);
    req.io?.to(req.user._id.toString()).emit('message:new', populated);

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    next(error);
  }
};
