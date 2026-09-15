import express from 'express';
import { getFooter, updateFooter } from '../controllers/FooterController.js';

const router = express.Router();

router.get('/',  getFooter);
router.put('/',  updateFooter);

export default router;