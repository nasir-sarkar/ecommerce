import express from 'express';
import {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  getCategories,
  getTags,
  getRecentBlogs,
  getPopularBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
} from '../controllers/BlogController.js';

const router = express.Router();

// Static/named routes first
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/recent', getRecentBlogs);
router.get('/popular', getPopularBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Dynamic routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Write routes
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.post('/:id/like', likeBlog);

export default router;