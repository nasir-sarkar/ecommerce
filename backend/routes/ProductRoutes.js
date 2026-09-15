import express from 'express';
import {
  getProducts,
  getFilters,
  getCategoryStats,
  getBrandsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  migrateProducts,
} from '../controllers/ProductController.js';

const router = express.Router();

// Migration endpoint
router.post('/migrate', migrateProducts);

// Static/named routes first (must come before /:id)
router.get('/filters',        getFilters);
router.get('/stats/category', getCategoryStats);
router.get('/brands',         getBrandsByCategory);
router.get('/brands/:category', getBrandsByCategory);

// Dynamic routes
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Write routes
router.post('/',       createProduct);
router.put('/:id',    updateProduct);
router.patch('/:id',  patchProduct);
router.delete('/:id', deleteProduct);

export default router;