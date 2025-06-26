// src/components/ChatWindow.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { socket } from '../utils/socket';
import { sendMessage, sendTypingIndicator } from '../services/chatService';

// Assuming Message type is defined elsewhere or here
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  read: boolean;
}

interface Props {
  selectedUser: { id: string; name: string };
}

export default function ChatWindow({ selectedUser }: Props) {
  const currentUser = useUserStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Effect 1: Fetch chat history and mark messages as read
  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser?.uid || !selectedUser?.id) return;
      try {
        const res = await fetch(`http://localhost:3001/api/messages/${currentUser.uid}/${selectedUser.id}`);
        const history: Message[] = await res.json();
        setMessages(history);

        // Mark messages from the selected user as read
        await fetch('http://localhost:3001/api/messages/read', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senderId: selectedUser.id, receiverId: currentUser.uid }),
        });

      } catch (err) {
        console.error('Error loading message history:', err);
      }
    };
    fetchHistory();
  }, [currentUser?.uid, selectedUser.id]);

  // Effect 2: Set up all socket event listeners for this chat window
  useEffect(() => {
    // Listener for receiving a new message in this chat
    const handleReceiveMessage = (newMessage: Message) => {
      // Only add the message if it belongs to the currently active chat
      if (newMessage.senderId === selectedUser.id && newMessage.receiverId === currentUser?.uid) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // Here you could also re-trigger the 'mark as read' API call
      }
    };
    
    // Listener for the confirmation that a message *we* sent was saved
    const handleMessageSentConfirmation = (sentMessage: Message) => {
      // This is crucial for a smooth UI. We replace our temporary message
      // with the real one from the database.
      setMessages((prevMessages) => 
        prevMessages.map(msg => 
          msg.id === 'temp-' + sentMessage.content ? sentMessage : msg
        )
      );
    };

    // CORRECTED: Consistent event name 'receive_message'
    socket.on('receive_message', handleReceiveMessage);
    // NEW: Listen for our own message confirmation
    socket.on('message_sent_confirmation', handleMessageSentConfirmation);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent_confirmation', handleMessageSentConfirmation);
    };
  }, [currentUser?.uid, selectedUser.id]); // Rerun if the user or chat partner changes

  // Effect 3: Scroll to the bottom when new messages are added
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!currentUser?.uid || !selectedUser?.id) return;
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // --- Optimistic UI Update ---
    // Create a temporary message so the user sees it instantly.
    // We will replace this with the real message from the server later.
    const tempMessage: Message = {
      id: 'temp-' + trimmedInput, // Give it a unique temporary ID
      content: trimmedInput,
      senderId: currentUser.uid,
      receiverId: selectedUser.id,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, tempMessage]);
    
    // Actually send the message to the server
    sendMessage(currentUser.uid, selectedUser.id, trimmedInput);
    setInput('');
    sendTypingIndicator(currentUser.uid, selectedUser.id, false); // Stop typing indicator
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!currentUser?.uid) return;
    
    if (e.target.value) {
        sendTypingIndicator(currentUser.uid, selectedUser.id, true);
    } else {
        sendTypingIndicator(currentUser.uid, selectedUser.id, false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 font-bold rounded-t-lg">
        Chat with {selectedUser.name}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id} // Use the real message ID
            className={`flex ${msg.senderId === currentUser!.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs lg:max-w-md ${
                msg.senderId === currentUser!.uid
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div className="p-2 flex gap-2 border-t dark:border-gray-700">
        <input
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 border px-2 py-1 rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
