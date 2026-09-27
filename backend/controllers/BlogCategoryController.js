import BlogCategory from '../models/BlogCategory.js';
import Blog from '../models/Blog.js';

// GET /api/blog-categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/blog-categories
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const exists = await BlogCategory.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
    });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await BlogCategory.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/blog-categories/:id  — rename + update all posts using old name
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await BlogCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const duplicate = await BlogCategory.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const oldName = category.name;
    category.name = name.trim();
    await category.save();

    // Update all blog posts that used the old category name
    await Blog.updateMany({ category: oldName }, { $set: { category: name.trim() } });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/blog-categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Block deletion if any published or draft posts still use it
    const postCount = await Blog.countDocuments({ category: category.name });
    if (postCount > 0) {
      return res.status(400).json({
        message: `Cannot delete "${category.name}" — ${postCount} post(s) still use this category. Reassign or delete those posts first.`,
      });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};