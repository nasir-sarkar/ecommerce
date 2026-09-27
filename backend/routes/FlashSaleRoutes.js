import express from 'express';
import {
  getFlashSale,
  updateFlashSale,
  updateBanner,
  addDeal,
  updateDeal,
  deleteDeal,
  getDealProducts,
  addProductToDeal,
  removeProductFromDeal,
  addSegment,
  updateSegment,
  deleteSegment,
  addProductToSegment,
  removeProductFromSegment,
  getSegmentProducts,
} from '../controllers/FlashSaleController.js';

const router = express.Router();


// Flash sale document
router.get('/',         getFlashSale);
router.put('/',         updateFlashSale);
router.patch('/banner', updateBanner);


// Deal cards
router.post('/deals',       addDeal);
router.put('/deals/:id',    updateDeal);
router.delete('/deals/:id', deleteDeal);


// Deal products
router.get('/deals/:id/products',                getDealProducts);
router.post('/deals/:id/products',               addProductToDeal);
router.delete('/deals/:id/products/:productId',  removeProductFromDeal);


// Segments (backward compat)
router.post('/segments',                               addSegment);
router.put('/segments/:segId',                         updateSegment);
router.delete('/segments/:segId',                      deleteSegment);
router.get('/segments/:segId/products',                getSegmentProducts);
router.post('/segments/:segId/products',               addProductToSegment);
router.delete('/segments/:segId/products/:productId',  removeProductFromSegment);

export default router;