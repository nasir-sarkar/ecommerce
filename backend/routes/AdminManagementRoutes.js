import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getAdmins,  createAdmin,  updateAdmin,  deleteAdmin,
  getUsers,   createUser,   updateUser,   deleteUser,   banUser,   setUserVerification,
  getSellers, createSeller, updateSeller, deleteSeller, approveSeller,
} from '../controllers/AdminController.js';

const router = express.Router();

// All routes below require a valid admin JWT
router.use(verifyToken, requireAdmin);

// Admins
router.get('/admins',         getAdmins);
router.post('/admins',        createAdmin);
router.put('/admins/:id',     updateAdmin);
router.delete('/admins/:id',  deleteAdmin);

// Users
router.get('/users',                     getUsers);
router.post('/users',                    createUser);
router.put('/users/:id',                 updateUser);
router.delete('/users/:id',              deleteUser);
router.patch('/users/:id/ban',           banUser);
router.patch('/users/:id/verification',  setUserVerification);

// Sellers
router.get('/sellers',              getSellers);
router.post('/sellers',             createSeller);
router.put('/sellers/:id',          updateSeller);
router.delete('/sellers/:id',       deleteSeller);
router.patch('/sellers/:id/approve', approveSeller);

export default router;