// src/index.ts
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import app from './app'; // Assuming you have an app.ts for express routes
import prisma from './prisma/client';
import { Message } from '@prisma/client'; // Import the Message type

dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT'] // Added PUT for your /read route
  }
});

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Event to join a room based on the user's ID
  // This is crucial for direct messaging.
  socket.on('join_room', (userId: string) => {
    if (userId) {
      socket.join(userId);
      console.log(`📥 Socket ${socket.id} joined room: ${userId}`);
    } else {
      console.warn(`⚠️ 'join_room' called without a userId from socket ${socket.id}`);
    }
  });

  // Event for sending a message
  // CORRECTED: Consistent event name 'send_message' and payload
  socket.on('send_message', async (data: { content: string; senderId: string; receiverId: string }) => {
    const { content, senderId, receiverId } = data;
    
    try {
      if (!content || !senderId || !receiverId) {
        console.error('❌ Invalid message payload received:', data);
        return;
      }

      // 1. Save the new message to the database
      const newMessage = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId
        }
      });

      // 2. Emit the message ONLY to the receiver's room.
      // The receiver will get this event whether their chat window is open or not.
      io.to(receiverId).emit('receive_message', newMessage);

      // 3. Emit a confirmation event back to the SENDER.
      // This confirms the message was saved and lets the sender's UI update.
      io.to(senderId).emit('message_sent_confirmation', newMessage);

    } catch (error) {
      console.error('❌ Error saving or sending message:', error);
      // Optional: Inform the sender about the failure
      socket.emit('send_message_error', { error: 'Failed to send message.' });
    }
  });

  // Event for when a user is typing
  socket.on('typing', ({ senderId, receiverId, isTyping }) => {
    io.to(receiverId).emit('user_typing', { senderId, isTyping });
  });


  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
});
