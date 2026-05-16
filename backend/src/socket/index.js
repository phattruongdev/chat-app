import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import User from '../models/User.js';

const onlineUsers = new Map();

export const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token is required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch (_error) {
      next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit('users:online', Array.from(onlineUsers.keys()));

    socket.on('message:send', async ({ receiverId, text }, callback) => {
      try {
        if (!receiverId || !text?.trim()) throw new Error('Receiver and text are required');

        const message = await Message.create({ sender: userId, receiver: receiverId, text: text.trim() });
        const populated = await message.populate('sender receiver', 'name email avatar lastSeen');

        io.to(receiverId).emit('message:new', populated);
        io.to(userId).emit('message:new', populated);
        callback?.({ success: true, message: populated });
      } catch (error) {
        callback?.({ success: false, message: error.message || 'Could not send message' });
      }
    });

    socket.on('typing:start', ({ receiverId }) => {
      if (receiverId) io.to(receiverId).emit('typing:start', { userId });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      if (receiverId) io.to(receiverId).emit('typing:stop', { userId });
    });

    socket.on('message:seen', async ({ messageId, senderId }) => {
      if (!messageId || !senderId) return;
      const seenAt = new Date();
      await Message.findOneAndUpdate({ _id: messageId, receiver: userId }, { seenAt }, { new: true });
      io.to(senderId).emit('message:seen', { messageId, seenAt, seenBy: userId });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      io.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};
