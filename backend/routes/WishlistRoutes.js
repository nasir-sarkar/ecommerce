import express from 'express';
import {
  getWishlist,
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/WishlistController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',           verifyToken, getWishlist);
router.get('/ids',        verifyToken, getWishlistIds);
router.post('/:productId',   verifyToken, addToWishlist);
router.delete('/:productId', verifyToken, removeFromWishlist);

export default router;