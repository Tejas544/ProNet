// src/services/chatService.ts
import { socket } from '../utils/socket';

/**
 * Sends a chat message via Socket.IO.
 * @param senderId - The sender's UID.
 * @param receiverId - The recipient's UID.
 * @param content - The message content.
 */
export const sendMessage = (senderId: string, receiverId: string, content: string) => {
  // CORRECTED: Payload now matches what the server expects.
  const messagePayload = {
    content,
    senderId,
    receiverId,
  };

  // CORRECTED: Event name is now 'send_message' to match the server.
  socket.emit('send_message', messagePayload);
};

/**
 * Emits a typing indicator event.
 * @param senderId
 * @param receiverId 
 * @param isTyping 
 */
export const sendTypingIndicator = (senderId: string, receiverId: string, isTyping: boolean) => {
  socket.emit('typing', { senderId, receiverId, isTyping });
};
