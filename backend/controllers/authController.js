const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Board = require('../models/Board');
const Task = require('../models/Task');
const { asyncHandler, isStrongPassword } = require('../utils/helpers');

function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const token = createToken(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: sanitizeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = createToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: sanitizeUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    user: sanitizeUser(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const boardsCount = await Board.countDocuments({ owner: userId });
  const totalTasksCount = await Task.countDocuments({ owner: userId });
  const todoCount = await Task.countDocuments({ owner: userId, status: 'todo' });
  const inProgressCount = await Task.countDocuments({ owner: userId, status: 'in-progress' });
  const doneCount = await Task.countDocuments({ owner: userId, status: 'done' });

  res.status(200).json({
    success: true,
    stats: {
      boardsCount,
      tasks: {
        total: totalTasksCount,
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { name, currentPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // 1. If password details are provided, validate and update password
  if (currentPassword || newPassword || newPasswordConfirm) {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirmation are required to change password',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  // 2. If name is provided, update it
  if (name) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }
    user.name = trimmedName;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: sanitizeUser(user),
  });
});

module.exports = {
  register,
  login,
  me,
  logout,
  getStats,
  updateProfile,
};
