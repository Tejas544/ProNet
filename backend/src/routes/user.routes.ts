// src/routes/user.routes.ts
import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller'; // ✅ named imports

const router = Router();

// Define RESTful routes for users
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
