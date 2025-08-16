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