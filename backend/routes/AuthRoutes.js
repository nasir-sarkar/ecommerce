import express from 'express';
import { 
  login, 
  loginAdmin, 
  loginUser, 
  loginSeller, 
  registerUser, 
  updateProfile, 
  changePassword,
  getUserProfile,
  updateAvatar,
  addAddress,
  updateAddress,
  deleteAddress,
  changeEmailWithPassword,
  deleteAccount,
} from '../controllers/AuthController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/login',           login);
router.post('/login/admin',     loginAdmin);
router.post('/login/user',      loginUser);
router.post('/login/seller',    loginSeller);
router.post('/register',        registerUser);

// Profile routes
router.get('/profile',          verifyToken, getUserProfile);
router.put('/update-profile',   verifyToken, updateProfile);
router.put('/update-avatar',    verifyToken, updateAvatar);
router.put('/change-password',  verifyToken, changePassword);

// Address routes
router.post('/address',              verifyToken, addAddress);
router.put('/address/:addressId',    verifyToken, updateAddress);
router.delete('/address/:addressId', verifyToken, deleteAddress);

// Email change route
router.put('/change-email', verifyToken, changeEmailWithPassword);

// Delete account route
router.delete('/account', verifyToken, deleteAccount);

export default router;