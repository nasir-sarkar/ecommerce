import express from 'express';
import { getDashboardStats, getSellerDashboardStats } from '../controllers/DashboardController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats',        verifyToken, requireAdmin, getDashboardStats);
router.get('/seller-stats', verifyToken, getSellerDashboardStats);

export default router;