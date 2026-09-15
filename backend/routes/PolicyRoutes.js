import express from 'express';
import { getPolicy, updatePolicy } from '../controllers/PolicyController.js';

const router = express.Router();

router.get('/:type',  getPolicy);
router.put('/:type',  updatePolicy);

export default router;