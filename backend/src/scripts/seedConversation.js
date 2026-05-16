import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const targetEmail = 'minhanh@example.com';
const sampleEmails = ['minhanh@example.com', 'hoangnam@example.com', 'baongoc@example.com', 'giahuy@example.com'];

const conversation = [
  ['sample', 'Chao Phat, minh vua xem qua ban chat app realtime cua ban roi. UI nhin gon va de test day.'],
  ['real', 'Cam on Anh. Minh dang muon test flow chat 1-1, online status va history message.'],
  ['sample', 'Ok. Hien tai minh thay danh sach user hien duoc, click vao user thi load conversation kha nhanh.'],
  ['real', 'Minh se test them truong hop reload trang xem token trong localStorage con giu login khong.'],
  ['sample', 'Nen test ca viec mo hai tab browser nua. Mot tab login user cua ban, tab kia login user mau nay.'],
  ['real', 'Dung roi. Neu gui tin nhan tu tab nay ma tab kia nhan ngay thi Socket.IO da on.'],
  ['sample', 'Minh cung se xem luc user logout thi online indicator co cap nhat sang offline khong.'],
  ['real', 'Phan seen message minh moi de event san, chua gan auto emit khi message vao viewport.'],
  ['sample', 'Khong sao, vay giai doan tiep theo co the them IntersectionObserver de danh dau da xem.'],
  ['real', 'Hay. Con typing indicator thi hien tai dang emit theo input change, can debounce de tranh spam event.'],
  ['sample', 'Chuan. Debounce khoang 500ms va auto stop sau 2-3 giay neu khong go nua la hop ly.'],
  ['real', 'Minh cung muon them search user server-side khi danh sach lon hon.'],
  ['sample', 'Luc do API /users nen nhan query va limit, frontend chi can goi lai khi search thay doi.'],
  ['real', 'Ok, truoc mat minh se dung conversation nay de test UI bubble, scroll va timestamp.'],
  ['sample', 'Tot. Neu ban thay duoc dong nay trong chat window thi seed conversation da chay thanh cong.']
];

const run = async () => {
  await connectDB();

  const realUser = await User.findOne({ email: { $nin: sampleEmails } }).sort({ createdAt: 1 });
  const sampleUser = await User.findOne({ email: targetEmail });

  if (!realUser) {
    throw new Error('No real user found. Register one account in the app first.');
  }

  if (!sampleUser) {
    throw new Error(`Sample user ${targetEmail} not found. Run npm --prefix backend run seed first.`);
  }

  await Message.deleteMany({
    $or: [
      { sender: realUser._id, receiver: sampleUser._id },
      { sender: sampleUser._id, receiver: realUser._id }
    ]
  });

  const startTime = Date.now() - conversation.length * 2 * 60 * 1000;
  const messages = conversation.map(([speaker, text], index) => ({
    sender: speaker === 'real' ? realUser._id : sampleUser._id,
    receiver: speaker === 'real' ? sampleUser._id : realUser._id,
    text,
    createdAt: new Date(startTime + index * 2 * 60 * 1000),
    updatedAt: new Date(startTime + index * 2 * 60 * 1000)
  }));

  await Message.insertMany(messages);

  console.log(`Created ${messages.length} realistic messages.`);
  console.log(`Conversation: ${realUser.name} <-> ${sampleUser.name}`);

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Seed conversation failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
