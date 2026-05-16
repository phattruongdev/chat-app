import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const sampleUsers = [
  {
    name: 'Nguyen Minh Anh',
    email: 'minhanh@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=32'
  },
  {
    name: 'Le Hoang Nam',
    email: 'hoangnam@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'Tran Bao Ngoc',
    email: 'baongoc@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=47'
  },
  {
    name: 'Pham Gia Huy',
    email: 'giahuy@example.com',
    password: '123456',
    avatar: 'https://i.pravatar.cc/150?img=59'
  }
];

const sampleTexts = [
  ['Chao ban, minh vua setup xong project chat.', 'Ok, minh thay realtime hoat dong roi.'],
  ['Hom nay ban test API auth chua?', 'Roi, register va login deu on.'],
  ['Minh se kiem tra responsive tren mobile.', 'Tot, phan sidebar can gon hon tren man hinh nho.'],
  ['Can them typing indicator khong?', 'Co, de UX giong chat app thuc te hon.']
];

const run = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('123456', 12);
  const createdSamples = [];

  for (const sample of sampleUsers) {
    const user = await User.findOneAndUpdate(
      { email: sample.email },
      {
        $set: {
          name: sample.name,
          avatar: sample.avatar
        },
        $setOnInsert: {
          email: sample.email,
          password: hashedPassword
        }
      },
      { new: true, upsert: true }
    );
    createdSamples.push(user);
  }

  const sampleEmails = sampleUsers.map((user) => user.email);
  const realUsers = await User.find({ email: { $nin: sampleEmails } });

  for (const realUser of realUsers) {
    for (const [index, sampleUser] of createdSamples.entries()) {
      const existingMessage = await Message.findOne({
        $or: [
          { sender: realUser._id, receiver: sampleUser._id },
          { sender: sampleUser._id, receiver: realUser._id }
        ]
      });

      if (existingMessage) continue;

      const [fromSample, fromReal] = sampleTexts[index % sampleTexts.length];

      await Message.create([
        {
          sender: sampleUser._id,
          receiver: realUser._id,
          text: fromSample,
          createdAt: new Date(Date.now() - (index + 2) * 60 * 60 * 1000)
        },
        {
          sender: realUser._id,
          receiver: sampleUser._id,
          text: fromReal,
          createdAt: new Date(Date.now() - (index + 1) * 60 * 60 * 1000)
        }
      ]);
    }
  }

  console.log(`Seeded ${createdSamples.length} sample users.`);
  console.log(`Linked sample conversations for ${realUsers.length} existing user(s).`);
  console.log('Sample login password for seeded users: 123456');

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
