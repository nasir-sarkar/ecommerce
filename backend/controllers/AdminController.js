import bcrypt from 'bcryptjs';
import Admin  from '../models/Admin.js';
import User   from '../models/User.js';
import Seller from '../models/Seller.js';

const hash = (pw) => bcrypt.hash(pw, 10);



// ADMINS
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: admins });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password, avatar } = req.body;
    if (!fullName || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });
    const admin = await Admin.create({ fullName, email, phone, password: await hash(password), avatar: avatar || '' });
    res.status(201).json({ success: true, data: { ...admin.toObject(), password: undefined } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateAdmin = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await hash(password);
    const admin = await Admin.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, data: admin });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};




// USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, avatar } = req.body;
    if (!fullName || !password) return res.status(400).json({ success: false, message: 'Full name and password required' });
    const user = await User.create({ fullName, email: email || '', phone: phone || '', password: await hash(password), avatar: avatar || '' });
    res.status(201).json({ success: true, data: { ...user.toObject(), password: undefined } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await hash(password);
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const setUserVerification = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['verified', 'unverified'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};





// SELLERS
export const getSellers = async (req, res) => {
  try {
    const { verified } = req.query;
    const filter = verified === 'true'
      ? { isVerified: true }
      : verified === 'false'
      ? { $or: [{ isVerified: false }, { isVerified: { $exists: false } }] }
      : {};
    const sellers = await Seller.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: sellers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const approveSeller = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { isVerified: !!isVerified },
      { new: true }
    ).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    res.json({ success: true, data: seller });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createSeller = async (req, res) => {
  try {
    const { fullName, shopName, email, phone, password, avatar } = req.body;
    if (!fullName || !shopName || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });
    const exists = await Seller.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });
    const seller = await Seller.create({ fullName, shopName, email, phone, password: await hash(password), avatar: avatar || '' });
    res.status(201).json({ success: true, data: { ...seller.toObject(), password: undefined } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateSeller = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password = await hash(password);
    const seller = await Seller.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    res.json({ success: true, data: seller });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Seller deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};