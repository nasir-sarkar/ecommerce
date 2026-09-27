import express from 'express';
import {
  getCategoryDiscounts,
  getCategoriesWithStats,
  createCategoryDiscount,
  removeCategoryDiscount,
  toggleCategoryDiscount
} from '../controllers/CategoryDiscountController.js';

const router = express.Router();

router.get('/', getCategoryDiscounts);
router.get('/categories-with-stats', getCategoriesWithStats);
router.post('/', createCategoryDiscount);
router.delete('/:id', removeCategoryDiscount);
router.put('/:id/toggle', toggleCategoryDiscount);

export default router;