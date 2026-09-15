import express from 'express';
import {
  getHome,
  updateHome,
  updateHeadlineBanner,
  updateHeroBanners,
  updateFlashDealBanner,
  updateHotCategories,
  updateFeaturedCategories,
  updatePromotionBanners,
  updateShopsLongBanner,
} from '../controllers/HomeController.js';

const router = express.Router();

router.get('/',                        getHome);
router.put('/',                        updateHome);
router.patch('/headline-banner',       updateHeadlineBanner);
router.patch('/hero-banners',          updateHeroBanners);
router.patch('/flash-deal-banner',     updateFlashDealBanner);
router.patch('/hot-categories',        updateHotCategories);
router.patch('/featured-categories',   updateFeaturedCategories);
router.patch('/promotion-banners',     updatePromotionBanners);
router.patch('/shops-long-banner',     updateShopsLongBanner);

export default router;