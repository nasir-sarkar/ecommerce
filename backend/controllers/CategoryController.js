import Category from '../models/Category.js';

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, img, icon, cols, order, level, featured, hot } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const count = await Category.countDocuments();
    const category = new Category({
      name, 
      img: img || '', 
      icon: icon || '',
      cols: cols || [],
      order: order !== undefined ? order : count,
      level: level !== undefined ? level : 0,
      featured: featured !== undefined ? featured : false,
      hot: hot !== undefined ? hot : false,
    });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { name, img, icon, cols, order, level, featured, hot } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    category.name  = name;
    category.img   = img   !== undefined ? img   : category.img;
    category.icon  = icon  !== undefined ? icon  : category.icon;
    category.cols  = cols  !== undefined ? cols  : category.cols;
    category.order = order !== undefined ? order : category.order;
    category.level = level !== undefined ? level : category.level;
    category.featured = featured !== undefined ? featured : category.featured;
    category.hot = hot !== undefined ? hot : category.hot;
    
    const saved = await category.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};