// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // This handler is crucial. The client must emit 'join_room' with their UID.
  socket.on('join_room', (uid) => {
    if (uid) {
      socket.join(uid); // The socket joins a room named after the user's UID.
      console.log(`📥 Socket ${socket.id} joined room ${uid}`);
    } else {
      console.log(`⚠️ join_room event received without a UID from socket ${socket.id}`);
    }
  });

  // This handler receives a message and forwards it to the recipient's room.
  socket.on('sendMessage', async ({ content, senderId, receiverId }) => {
    // 1. Save to DB
    const message = await prisma.message.create({
      data: { content, senderId, receiverId },
    });
  
    // 2. Emit to both users if connected
    io.to(receiverId).emit('receiveMessage', message);
  });
  

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running on port 3001');
});
