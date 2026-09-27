import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getProductReviews,
  createProductReview,
  getAllProductReviewsForAdmin,
  getProductReviewsForAdmin,
  createCustomReview,
  deleteReview,
} from '../controllers/ProductReviewController.js';

const router = express.Router();

// Public / customer
router.get('/:productId', getProductReviews);
router.post('/', verifyToken, createProductReview);

// Admin routes (protected)
router.get('/admin/all-reviews', verifyToken, getAllProductReviewsForAdmin);
router.get('/admin/product/:productId', verifyToken, getProductReviewsForAdmin);
router.post('/admin/custom', verifyToken, createCustomReview);
router.delete('/admin/:reviewId', verifyToken, deleteReview);

export default router;