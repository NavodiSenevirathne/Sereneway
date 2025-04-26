// user.routes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin
} from '../controllers/userController.js';

 import authMiddleware from '../middleware/authMiddleware.js';


const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (user profile management)
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/profile', authMiddleware, getUserProfile);

// Admin-only routes (for admin management of users)
router.get('/users', getAllUsers);
router.put('/user/:userId', updateUserByAdmin);
router.delete('/user/:userId', deleteUserByAdmin);

export default router;
