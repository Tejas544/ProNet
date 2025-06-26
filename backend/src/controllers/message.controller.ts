import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getMessagesBetweenUsers = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 }
        ]
      },
      orderBy: {
        timestamp: 'asc'
      }
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};
export const markMessagesAsRead = async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.body;
  
    try {
      await prisma.message.updateMany({
        where: {
          senderId,
          receiverId,
          read: false
        },
        data: { read: true }
      });
   
      res.json({ message: 'Messages marked as read' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update messages' });
    }
  };
  export const createMessage = async (req: Request, res: Response) => {
    const { senderId, receiverId, content } = req.body;
  
    try {
      const message = await prisma.message.create({
        data: { senderId, receiverId, content },
      });
      res.status(201).json(message);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Message save failed' });
    }
  };
  
