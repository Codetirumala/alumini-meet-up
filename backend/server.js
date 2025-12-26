require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Build CORS allowlist from comma-separated FRONTEND_URL(s)
const rawOrigins = process.env.FRONTEND_URL || '';
const allowList = rawOrigins
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOrigin = (origin, callback) => {
  // Allow requests with no origin (mobile apps, curl, same-origin)
  if (!origin) return callback(null, true);
  
  // If no FRONTEND_URL configured, allow all localhost/127.0.0.1 for development
  if (allowList.length === 0) {
    const isLocalhost = origin.startsWith('http://localhost:') || 
                       origin.startsWith('http://127.0.0.1:') ||
                       origin.startsWith('https://localhost:');
    return callback(null, isLocalhost);
  }
  
  // Check if origin is in the allowList
  if (allowList.includes(origin)) {
    return callback(null, true);
  }
  
  // Also allow localhost even when allowList is configured (for local dev)
  const isLocalhost = origin.startsWith('http://localhost:') || 
                     origin.startsWith('http://127.0.0.1:') ||
                     origin.startsWith('https://localhost:');
  if (isLocalhost) {
    return callback(null, true);
  }
  
  // Reject origin (don't throw error, just return false)
  console.log(`CORS: Rejected origin: ${origin}`);
  callback(null, false);
};

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middlewares
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/connections', require('./routes/connectionRoutes'));


// Test route
app.get('/', (req, res) => {
  res.send('Alumni Management API is running');
});


const { protect } = require('./middlewares/authMiddleware');

app.get('/api/protected', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  });
});

// Socket.io connection
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      if (!token) {
        console.error('No token provided');
        socket.emit('authError', { message: 'No token provided' });
        socket.disconnect();
        return;
      }

      console.log('Received token for authentication:', token.substring(0, 20) + '...');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      // Handle both 'id' and '_id' in the token payload
      const userId = decoded._id || decoded.id;
      
      if (!userId) {
        console.error('No user ID found in token payload:', decoded);
        socket.emit('authError', { message: 'Invalid token payload' });
        socket.disconnect();
        return;
      }
      
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      
      socket.emit('authenticated', { userId: userId });
      io.emit('userOnline', { userId: userId });
      
      console.log('User authenticated:', userId);
      
      // Fetch and deliver unread messages from when user was offline
      try {
        const Message = require('./models/Message');
        const unreadMessages = await Message.find({ receiver: userId, read: false })
          .populate('sender', '_id firstName lastName')
          .sort({ createdAt: 1 });
        
        console.log(`Found ${unreadMessages.length} unread messages for ${userId}`);
        
        if (unreadMessages.length > 0) {
          socket.emit('unreadMessages', unreadMessages);
        }
      } catch (err) {
        console.error('Error fetching unread messages:', err);
      }
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      socket.emit('authError', { message: error.message });
      socket.disconnect();
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      if (!socket.userId) {
        console.error('Unauthenticated user trying to send message');
        return;
      }
      
      const { receiverId, content } = data;
      console.log(`Message from ${socket.userId} to ${receiverId}: ${content}`);
      console.log(`Receiver socket ID: ${onlineUsers.get(receiverId)}`);
      console.log(`Online users:`, Array.from(onlineUsers.keys()));
      
      // Emit to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        console.log(`Emitting to receiver socket: ${receiverSocketId}`);
        io.to(receiverSocketId).emit('receiveMessage', {
          _id: Date.now().toString(),
          senderId: socket.userId,
          receiverId: receiverId,
          content,
          timestamp: new Date(),
          createdAt: new Date()
        });
      } else {
        console.log(`Receiver ${receiverId} is not online`);
      }

      // Emit back to sender for confirmation
      socket.emit('messageSent', {
        receiverId,
        content,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('messageError', { error: error.message });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const receiverSocketId = onlineUsers.get(data.receiverId);
    if (receiverSocketId && socket.userId) {
      io.to(receiverSocketId).emit('userTyping', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    }
  });

  // Handle getting unread count
  socket.on('getUnreadCount', async () => {
    if (!socket.userId) return;
    
    try {
      const Message = require('./models/Message');
      const unreadCount = await Message.countDocuments({
        receiver: socket.userId,
        read: false
      });
      
      socket.emit('unreadCount', { count: unreadCount });
    } catch (err) {
      console.error('Error getting unread count:', err);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('userOffline', { userId: socket.userId });
      console.log('User disconnected:', socket.userId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
