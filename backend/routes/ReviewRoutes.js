import express from 'express';
import {
  getReviewsBySeller,
  createReview,
  deleteReview,
} from '../controllers/ReviewController.js';

const router = express.Router();

router.get('/:sellerName', getReviewsBySeller);
router.post('/',           createReview);
router.delete('/:id',      deleteReview);

export default router;