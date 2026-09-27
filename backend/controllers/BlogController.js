import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import BlogCategory from '../models/BlogCategory.js';


// GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const {
      category,
      tag,
      search,
      sortBy = 'newest',
      page = 1,
      limit = 9,
      admin = 'false'
    } = req.query;

    // admin=true shows all blogs including drafts (for admin panel)
    const filter = admin === 'true' ? {} : { isPublished: true };

    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      newest: { publishedAt: -1 },
      oldest: { publishedAt: 1 },
      'most-viewed': { views: -1 },
      'most-liked': { likes: -1 }
    };
    const sort = sortMap[sortBy] || { publishedAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      blogs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.incrementViews();

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      isPublished: true
    })
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({ blog, relatedBlogs });
  } catch (err) {
    console.error('getBlogById error:', err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/slug/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.incrementViews();

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      isPublished: true
    })
      .sort({ publishedAt: -1 })
      .limit(3);

    res.json({ blog, relatedBlogs });
  } catch (err) {
    console.error('getBlogBySlug error:', err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/categories
export const getCategories = async (req, res) => {
  try {
    // Post-derived counts (from existing blog documents)
    const postCats = await Blog.aggregate([
      { $match: { category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    postCats.forEach(c => { countMap[c._id] = c.count; });

    // Standalone categories created via admin
    const standaloneCats = await BlogCategory.find().sort({ name: 1 });

    // Merge: standalone categories first, then any post-derived names not yet in standalone list
    const seen = new Set();
    const result = [];

    standaloneCats.forEach(cat => {
      seen.add(cat.name);
      result.push({ name: cat.name, count: countMap[cat.name] || 0 });
    });

    postCats.forEach(cat => {
      if (!seen.has(cat._id)) {
        result.push({ name: cat._id, count: cat.count });
      }
    });

    // Sort by count desc, then name asc
    result.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/tags
export const getTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/recent
export const getRecentBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const recentBlogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(Number(limit))
      .select('title slug featuredImage category publishedAt');

    res.json(recentBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/blogs/popular
export const getPopularBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const popularBlogs = await Blog.find({ isPublished: true })
      .sort({ views: -1, likes: -1 })
      .limit(Number(limit))
      .select('title slug featuredImage category views likes');

    res.json(popularBlogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      images,
      category,
      tags,
      author,
      isPublished
    } = req.body;

    if (!title || !excerpt || !content || !featuredImage || !category) {
      return res.status(400).json({
        message: 'Missing required fields: title, excerpt, content, featuredImage, category'
      });
    }

    // Generate a unique slug from title
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      images: images || [],
      category,
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : true,
      author: author || {
        name: 'Active IT Zone Limited',
        avatar: 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder-rect.jpg',
        bio: 'Power Elite Author on Envato'
      }
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error('createBlog error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A blog post with this title already exists. Please use a different title.' });
    }
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const {
      title,
      excerpt,
      content,
      featuredImage,
      images,
      category,
      tags,
      author,
      isPublished
    } = req.body;

    // Build only the fields that were actually sent
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (featuredImage !== undefined) updates.featuredImage = featuredImage;
    if (images !== undefined) updates.images = images;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (author !== undefined) updates.author = author;
    if (isPublished !== undefined) updates.isPublished = isPublished;

    // If title changed, regenerate slug
    if (title !== undefined) {
      let baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      let slug = baseSlug;
      let counter = 1;
      
      // Check for existing slug
      let existingBlog;
      do {
        existingBlog = await Blog.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingBlog) {
          slug = `${baseSlug}-${counter++}`;
        }
      } while (existingBlog);
      
      updates.slug = slug;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (err) {
    console.error('updateBlog error:', err);
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/blogs/:id/like
export const likeBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, select: 'likes' }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};