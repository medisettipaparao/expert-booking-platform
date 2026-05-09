require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');

const experts = [
  { name: 'Dr. John Smith', category: 'Medical', experience: 15, rating: 4.8, image: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Jane Doe', category: 'Career Coaching', experience: 8, rating: 4.5, image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Alice Johnson', category: 'Therapy', experience: 12, rating: 4.9, image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Bob Williams', category: 'Fitness', experience: 10, rating: 4.6, image: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Sarah Brown', category: 'Finance', experience: 20, rating: 4.7, image: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Michael Davis', category: 'Legal', experience: 14, rating: 4.4, image: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Emma Wilson', category: 'Career Coaching', experience: 5, rating: 4.2, image: 'https://i.pravatar.cc/150?img=26' },
  { name: 'James Taylor', category: 'Medical', experience: 22, rating: 4.9, image: 'https://i.pravatar.cc/150?img=33' },
  { name: 'Olivia Martinez', category: 'Therapy', experience: 7, rating: 4.3, image: 'https://i.pravatar.cc/150?img=41' },
  { name: 'William Anderson', category: 'Fitness', experience: 6, rating: 4.1, image: 'https://i.pravatar.cc/150?img=53' },
  { name: 'Sophia Thomas', category: 'Finance', experience: 11, rating: 4.8, image: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Benjamin Jackson', category: 'Legal', experience: 18, rating: 4.6, image: 'https://i.pravatar.cc/150?img=59' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected. Seeding data...');
  await Expert.deleteMany();
  await Expert.insertMany(experts);
  console.log('Data seeded successfully!');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
