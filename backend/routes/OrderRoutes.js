import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  placeOrder,
  getUserOrders,
  getUserOrder,
  cancelUserOrder,
  reorderItems,
  getSellerOrders,
  updateOrderStatus,
  adminGetAllOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
} from '../controllers/OrderController.js';

const router = express.Router();

// User routes
router.post('/',               verifyToken, placeOrder);
router.get('/my-orders',       verifyToken, getUserOrders);
router.get('/my-orders/:id',   verifyToken, getUserOrder);
router.post('/:id/cancel',     verifyToken, cancelUserOrder);
router.post('/:id/reorder',    verifyToken, reorderItems);

// Seller routes
router.get('/seller',       verifyToken, getSellerOrders);
router.patch('/:id/status', verifyToken, updateOrderStatus);

// Admin routes
router.get('/admin/all',             verifyToken, requireAdmin, adminGetAllOrders);
router.get('/admin/:id',             verifyToken, requireAdmin, adminGetOrder);
router.patch('/admin/:id/status',    verifyToken, requireAdmin, adminUpdateOrderStatus);
router.patch('/admin/:id/payment',   verifyToken, requireAdmin, adminUpdatePaymentStatus);

export default router;