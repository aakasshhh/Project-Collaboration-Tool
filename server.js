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