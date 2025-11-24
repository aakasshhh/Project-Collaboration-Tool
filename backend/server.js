const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const { registerSocket } = require('./utils/socket');

dotenv.config();

const emailService = require('./services/emailService');

// Routes
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const activityRoutes = require('./routes/activity.routes');

const app = express();
const server = http.createServer(app);

// Socket.io with correct CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL.split(','),
    credentials: true
  }
});

// Attach io + email service to req
app.use((req, _, next) => {
  req.io = io;
  req.emailService = emailService;
  next();
});

// Correct CORS for backend API
app.use(
  cors({
    origin: process.env.CLIENT_URL.split(','),
    credentials: true
  })
);

app.use(express.json());

// Root API check
app.get('/', (_, res) => res.json({ status: 'Backend OK' }));

// Passport
app.use(passport.initialize());
configurePassport(passport, process.env.JWT_SECRET);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Server error' });
});

// Start Server + DB
const PORT = process.env.PORT || 8000;

(async () => {
  await connectDB(process.env.MONGO_URL);
  registerSocket(io);

  const emailTest = await emailService.testConnection();
  if (emailTest.success) {
    console.log('Email service connected successfully');
  } else {
    console.log('Email service connection failed:', emailTest.error);
  }

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Email service configured for: ${process.env.EMAIL_USERNAME}`);
  });
})();
