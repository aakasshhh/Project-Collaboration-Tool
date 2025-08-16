const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const { Server } = require('socket.io');
const connectDB = require('./backend/config/db');
const configurePassport = require('./backend/config/passport');
//const { registerSocket } = require('./utils/socket');

dotenv.config();

//const emailService = require('./services/emailService');


// routes
const authRoutes = require('./backend/routes/auth.routes');
const teamRoutes = require('./backend/routes/team.routes');
const projectRoutes = require('./backend/routes/project.routes');
//const taskRoutes = require('./routes/task.routes');
const activityRoutes = require('./backend/routes/activity.routes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true
  }
});

app.use((req, _, next) => {
  req.io = io;
  // MAKE EMAIL SERVICE AVAILABLE IN ALL ROUTES - NEW
  req.emailService = emailService;
  next();
});

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.json({ status: 'ok' }));

// Passport
app.use(passport.initialize());
configurePassport(passport, process.env.JWT_SECRET);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

// DB + Socket
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
    console.log(`Server listening on : ${PORT}`);
    console.log(`Email service configured for: ${process.env.EMAIL_USERNAME}`);
  });
})();