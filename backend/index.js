import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/ProductRoutes.js';
import blogRoutes from './routes/BlogRoutes.js';
import blogCategoryRoutes from './routes/BlogCategoryRoutes.js';
import contactRoutes from './routes/ContactRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';
import flashSaleRoutes from './routes/FlashSaleRoutes.js';
import homeRoutes from './routes/HomeRoutes.js';
import reviewRoutes from './routes/ReviewRoutes.js';
import brandRoutes from './routes/BrandRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import adminManagementRoutes from './routes/AdminManagementRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productReviewRoutes from './routes/ProductReviewRoutes.js';
import sellerRoutes from './routes/SellerRoutes.js';
import footerRoutes from './routes/FooterRoutes.js';
import policyRoutes from './routes/PolicyRoutes.js';
import categoryDiscountRoutes from './routes/CategoryDiscountRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import wishlistRoutes from './routes/WishlistRoutes.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use('/api/products',        productRoutes);
app.use('/api/blogs',           blogRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/contact',         contactRoutes);
app.use('/api/upload',          uploadRoutes);
app.use('/api/flash-sale',      flashSaleRoutes);
app.use('/api/home',            homeRoutes);
app.use('/api/reviews',         reviewRoutes);
app.use('/api/brands',          brandRoutes);
app.use('/api/categories',      categoryRoutes);
app.use('/api/auth',            authRoutes);
app.use('/api/manage',          adminManagementRoutes);
app.use('/api/orders',          orderRoutes);
app.use('/api/product-reviews', productReviewRoutes);
app.use('/api/sellers',         sellerRoutes);
app.use('/api/footer',          footerRoutes);
app.use('/api/policy',          policyRoutes);
app.use('/api/category-discounts', categoryDiscountRoutes);
app.use('/api/dashboard',       dashboardRoutes);
app.use('/api/wishlist',        wishlistRoutes);

app.get('/', (req, res) => res.send('Server and Database are running!'));

app.listen(port, () => console.log(`Server started on port ${port}`));