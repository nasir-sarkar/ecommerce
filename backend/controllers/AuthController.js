import bcrypt from 'bcryptjs';
import Admin  from '../models/Admin.js';
import User   from '../models/User.js';
import Seller from '../models/Seller.js';
import { generateToken } from '../middleware/auth.js';

// ROLE-SPECIFIC LOGIN HELPER
const loginAs = (allowedRole) => async (req, res) => {
  try {
    const { email: identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ success: false, message: 'Email/phone and password required' });

    let account = null;
    const role  = allowedRole;

    if (role === 'admin') {
      account = await Admin.findOne({ email: identifier });
    } else if (role === 'seller') {
      account = await Seller.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    } else if (role === 'user') {
      account = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    }

    if (!account)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const payload = {
      id: account._id.toString(),
      role,
      email: account.email || '',
      fullName: account.fullName,
      phone: account.phone || '',
      avatar: account.avatar || '',
      ...(role === 'seller' && { shopName: account.shopName }),
    };
    const token = generateToken(payload);

    return res.json({
      success: true,
      token,
      role,
      user: {
        id: account._id.toString(),
        fullName: account.fullName,
        email: account.email || '',
        phone: account.phone || '',
        avatar: account.avatar || '',
        ...(role === 'seller' && { shopName: account.shopName }),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const loginAdmin  = loginAs('admin');
export const loginUser   = loginAs('user');
export const loginSeller = loginAs('seller');

// UNIFIED LOGIN
export const login = async (req, res) => {
  try {
    const { email: identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ success: false, message: 'Email/phone and password required' });

    let account = null;
    let role    = null;

    const admin = await Admin.findOne({ email: identifier });
    if (admin) { account = admin; role = 'admin'; }

    if (!account) {
      const seller = await Seller.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
      if (seller) { account = seller; role = 'seller'; }
    }

    if (!account) {
      const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
      if (user) { account = user; role = 'user'; }
    }

    if (!account)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const payload = {
      id: account._id.toString(),
      role,
      email: account.email || '',
      fullName: account.fullName,
      phone: account.phone || '',
      avatar: account.avatar || '',
      ...(role === 'seller' && { shopName: account.shopName }),
    };
    const token = generateToken(payload);

    return res.json({
      success: true,
      token,
      role,
      user: {
        id: account._id.toString(),
        fullName: account.fullName,
        email: account.email || '',
        phone: account.phone || '',
        avatar: account.avatar || '',
        ...(role === 'seller' && { shopName: account.shopName }),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// USER SELF-REGISTRATION
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !password)
      return res.status(400).json({ success: false, message: 'Full name and password are required' });
    if (!email && !phone)
      return res.status(400).json({ success: false, message: 'Email or phone is required' });

    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    if (phone) {
      const exists = await User.findOne({ phone });
      if (exists) return res.status(400).json({ success: false, message: 'Phone already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ 
      fullName, 
      email: email || '', 
      phone: phone || '', 
      password: hashed,
      avatar: '',
      addresses: []
    });

    const payload = { 
      id: user._id.toString(), 
      role: 'user', 
      email: user.email || '', 
      fullName: user.fullName,
      phone: user.phone || '',
      avatar: user.avatar || ''
    };
    const token = generateToken(payload);
    
    res.status(201).json({
      success: true,
      token,
      role: 'user',
      user: { 
        id: user._id.toString(), 
        fullName: user.fullName, 
        email: user.email || '', 
        phone: user.phone || '',
        avatar: user.avatar || ''
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET USER PROFILE — supports admin, seller, and user roles
export const getUserProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let account = null;

    if (role === 'admin') {
      account = await Admin.findById(id).select('-password');
    } else if (role === 'seller') {
      account = await Seller.findById(id).select('-password');
    } else {
      account = await User.findById(id).select('-password');
    }

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({
      success: true,
      user: {
        id: account._id.toString(),
        fullName: account.fullName,
        email: account.email || '',
        phone: account.phone || '',
        avatar: account.avatar || '',
        ...(role === 'seller' && { shopName: account.shopName }),
        ...(role === 'user' && { addresses: account.addresses || [] }),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE PROFILE (admin, user, or seller)
export const updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { fullName, phone, avatar } = req.body;

    if (!fullName || !fullName.trim())
      return res.status(400).json({ success: false, message: 'Full name is required' });

    let account;
    if (role === 'user') {
      const update = { fullName: fullName.trim(), phone: phone?.trim() || '' };
      if (avatar) update.avatar = avatar; // only touch avatar when explicitly sent
      account = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    } else if (role === 'seller') {
      const update = { fullName: fullName.trim(), phone: phone?.trim() || '' };
      if (req.body.shopName) update.shopName = req.body.shopName.trim();
      if (avatar) update.avatar = avatar;
      account = await Seller.findByIdAndUpdate(id, update, { new: true }).select('-password');
    } else if (role === 'admin') {
      const update = { fullName: fullName.trim(), phone: phone?.trim() || '' };
      if (avatar) update.avatar = avatar; // only touch avatar when explicitly sent
      account = await Admin.findByIdAndUpdate(id, update, { new: true }).select('-password');
    } else {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    if (!account)
      return res.status(404).json({ success: false, message: 'Account not found' });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: account._id.toString(),
        fullName: account.fullName,
        email: account.email || '',
        phone: account.phone || '',
        avatar: account.avatar || '',
        ...(role === 'seller' && { shopName: account.shopName }),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE AVATAR (supports admin, user, and seller)
export const updateAvatar = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ success: false, message: 'Avatar URL is required' });
    }

    let account;
    if (role === 'user') {
      account = await User.findByIdAndUpdate(id, { avatar }, { new: true }).select('-password');
    } else if (role === 'seller') {
      account = await Seller.findByIdAndUpdate(id, { avatar }, { new: true }).select('-password');
    } else if (role === 'admin') {
      account = await Admin.findByIdAndUpdate(id, { avatar }, { new: true }).select('-password');
    } else {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: account.avatar
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CHANGE PASSWORD (user or seller - admin password change managed separately)
export const changePassword = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    let account;
    if (role === 'user')        account = await User.findById(id);
    else if (role === 'seller') account = await Seller.findById(id);
    else if (role === 'admin')  account = await Admin.findById(id);
    else return res.status(403).json({ success: false, message: 'Not allowed' });

    if (!account)
      return res.status(404).json({ success: false, message: 'Account not found' });

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { address, postalCode, city, state, country, phone, isDefaultShipping, isDefaultBilling } = req.body;

    if (!address || !city || !state || !country) {
      return res.status(400).json({ success: false, message: 'Address, city, state, and country are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newAddress = {
      address,
      postalCode: postalCode || '',
      city,
      state,
      country,
      phone: phone || user.phone,
      isDefaultShipping: isDefaultShipping || false,
      isDefaultBilling: isDefaultBilling || false
    };

    if (newAddress.isDefaultShipping) {
      user.addresses = user.addresses.map(addr => {
        addr.isDefaultShipping = false;
        return addr;
      });
    }
    if (newAddress.isDefaultBilling) {
      user.addresses = user.addresses.map(addr => {
        addr.isDefaultBilling = false;
        return addr;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    const updatedUser = await User.findById(id).select('-password');
    
    res.json({
      success: true,
      message: 'Address added successfully',
      addresses: updatedUser.addresses || []
    });
  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE ADDRESS
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;
    const { address, postalCode, city, state, country, phone, isDefaultShipping, isDefaultBilling } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (isDefaultShipping === true) {
      user.addresses = user.addresses.map(addr => {
        addr.isDefaultShipping = false;
        return addr;
      });
    }
    
    if (isDefaultBilling === true) {
      user.addresses = user.addresses.map(addr => {
        addr.isDefaultBilling = false;
        return addr;
      });
    }

    user.addresses[addressIndex] = {
      _id: user.addresses[addressIndex]._id,
      address: address || user.addresses[addressIndex].address,
      postalCode: postalCode !== undefined ? postalCode : user.addresses[addressIndex].postalCode,
      city: city || user.addresses[addressIndex].city,
      state: state || user.addresses[addressIndex].state,
      country: country || user.addresses[addressIndex].country,
      phone: phone || user.addresses[addressIndex].phone,
      isDefaultShipping: isDefaultShipping !== undefined ? isDefaultShipping : user.addresses[addressIndex].isDefaultShipping,
      isDefaultBilling: isDefaultBilling !== undefined ? isDefaultBilling : user.addresses[addressIndex].isDefaultBilling
    };

    await user.save();

    const updatedUser = await User.findById(id).select('-password');
    
    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: updatedUser.addresses || []
    });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { addressId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    const updatedUser = await User.findById(id).select('-password');
    
    res.json({
      success: true,
      message: 'Address deleted successfully',
      addresses: updatedUser.addresses || []
    });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// CHANGE EMAIL WITH PASSWORD VERIFICATION (supports user and seller)
export const changeEmailWithPassword = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { newEmail, password } = req.body;

    if (!newEmail) {
      return res.status(400).json({ success: false, message: 'New email is required' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required to change email' });
    }

    // Check email uniqueness across both collections
    const [existingUser, existingSeller] = await Promise.all([
      User.findOne({ email: newEmail }),
      Seller.findOne({ email: newEmail }),
    ]);
    const emailTakenByOther =
      (existingUser   && existingUser._id.toString()   !== id) ||
      (existingSeller && existingSeller._id.toString() !== id);
    if (emailTakenByOther) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    if (role === 'seller') {
      const seller = await Seller.findById(id);
      if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect password' });

      seller.email = newEmail;
      await seller.save();

      const payload = {
        id: seller._id.toString(),
        role: 'seller',
        email: seller.email,
        fullName: seller.fullName,
        shopName: seller.shopName,
        phone: seller.phone || '',
        avatar: seller.avatar || '',
      };
      const token = generateToken(payload);
      return res.json({ success: true, message: 'Email updated successfully', token, email: seller.email });
    }

    // Default: user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect password' });

    user.email = newEmail;
    await user.save();

    const payload = {
      id: user._id.toString(),
      role: 'user',
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      avatar: user.avatar || '',
    };
    const token = generateToken(payload);

    return res.json({ success: true, message: 'Email updated successfully', token, email: user.email });
  } catch (err) {
    console.error('Change email error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE ACCOUNT — permanently removes the logged-in user from the database
export const deleteAccount = async (req, res) => {
  try {
    const { id, role } = req.user;

    // Only users can self-delete through this endpoint
    if (role !== 'user') {
      return res.status(403).json({ success: false, message: 'Only user accounts can be deleted this way' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};