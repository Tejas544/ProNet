# ProNet 🔗  
**A full-stack professional networking platform** (LinkedIn clone) built with **React, TypeScript, Tailwind**, and **Node.js, Express, Prisma, MySQL**, supporting real-time chat and connection management.

---

## 🌐 Live Demo

> _Coming Soon_ (Deploy on Vercel for frontend + Render/EC2 for backend)

---

## 📦 Tech Stack

### ⚙️ Backend  
- **Node.js** with **Express.js**
- **Prisma ORM** (with MySQL)
- **Socket.IO** – Real-time messaging
- **RESTful APIs**
- **dotenv** – Secure environment variable handling

### 💻 Frontend  
- **React + TypeScript**
- **Vite** – Fast build
- **Tailwind CSS** – UI styling
- **Zustand** – Global state management
- **Socket.IO-client** – Real-time communication
- **Firebase Firestore** – For storing user connections

---

## ✨ Features

### 👥 User Connections
- Search users
- Send and accept connection requests
- View and manage your network

### 💬 Real-Time Chat
- One-to-one chat with your connections
- Real-time messages using **Socket.IO**
- Messages stored in **MySQL** (not just temporary)
- Typing indicator (optional)
- Unread message notifications

### 🧠 Backend Highlights
- Users and messages stored in a relational DB
- Efficient message queries between 2 users
- Marking messages as **read** on view
- REST API with validation and clean controllers

---

## 🔧 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Tejas544/ProNet.git
cd ProNet
