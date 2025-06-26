import { RequestHandler } from 'express';
import prisma from '../prisma/client';


export const createUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, handle, bio, photo } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return; // ✅ Don't return res.json(), just exit function
    }

    const newUser = await prisma.user.create({
      data: { name, email, handle, bio, photo },
    });

    res.status(201).json(newUser); // ✅ Send response
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ error: 'Server error while creating user' });
  }
};


// Get all users
export const getAllUsers: RequestHandler = async (_req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ error: 'Server error while retrieving users' });
  }
};

// Get user by ID
export const getUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ error: 'Server error while retrieving user' });
  }
};

// Update user
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, handle, bio, photo } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, handle, bio, photo },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ error: 'Server error while updating user' });
  }
};

// Delete user
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
};
