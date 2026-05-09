require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:'https://expert-booking-platform-tau.vercel.app',
    methods: ['GET', 'POST', 'PATCH']
  }
});

app.set('io', io);

// Middleware
app.use(cors({
  origin: "https://expert-booking-platform-tau.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/experts', expertRoutes);
app.use('/bookings', bookingRoutes);

// Socket.io for Real-Time Updates
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection & Seeding
const { MongoMemoryServer } = require('mongodb-memory-server');
const Expert = require('./models/Expert');

const startServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('MongoDB Memory Server connected successfully');

    // Seeding Data
    const expertsCount = await Expert.countDocuments();
    if (expertsCount === 0) {
      console.log('Seeding data...');
      const experts = [
        { name: 'Dr. John Smith', category: 'Medical', experience: 15, rating: 4.8, image: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Jane Doe', category: 'Career Coaching', experience: 8, rating: 4.5, image: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Alice Johnson', category: 'Therapy', experience: 12, rating: 4.9, image: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Bob Williams', category: 'Fitness', experience: 10, rating: 4.6, image: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Sarah Brown', category: 'Finance', experience: 20, rating: 4.7, image: 'https://i.pravatar.cc/150?img=20' },
        { name: 'Michael Davis', category: 'Legal', experience: 14, rating: 4.4, image: 'https://i.pravatar.cc/150?img=14' },
      ];
      await Expert.insertMany(experts);
      console.log('Data seeded successfully!');
    }

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
