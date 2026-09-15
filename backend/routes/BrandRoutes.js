import express from 'express'
import {
  getBrands,
  getAllBrandConfigs,
  createBrandConfig,
  updateBrandConfig,
  deleteBrandConfig
} from '../controllers/BrandController.js'

const router = express.Router()

// Public routes
router.get('/active', getBrands)

// Admin routes
router.get('/', getAllBrandConfigs)
router.post('/', createBrandConfig)
router.put('/:id', updateBrandConfig)
router.delete('/:id', deleteBrandConfig)

export default router