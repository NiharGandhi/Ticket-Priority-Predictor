const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const SALT_ROUNDS = process.env.NODE_ENV === 'production' ? 10 : 8;

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use. Try logging in instead.',
        fieldErrors: { email: 'Email already in use. Try logging in instead.' },
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed, role });
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    // Catch Mongoose duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use. Try logging in instead.',
        fieldErrors: { email: 'Email already in use. Try logging in instead.' },
      });
    }
    // Catch Mongoose validation errors
    if (err.name === 'ValidationError') {
      const fieldErrors = {};
      Object.keys(err.errors).forEach((field) => {
        fieldErrors[field] = err.errors[field].message;
      });
      return res.status(400).json({
        success: false,
        message: Object.values(fieldErrors).join('. '),
        fieldErrors,
      });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = generateToken(user);
    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    res.json({ success: true, data: req.user });
  } catch (err) { next(err); }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out' });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ success: true, message: 'If that email exists, we sent reset instructions' });
    const token = crypto.randomBytes(20).toString('hex');
    res.json({ success: true, message: 'Password reset token (dev only)', data: { token } });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);
    res.json({ success: true, message: 'Password reset (demo) - implement token mapping in production' });
  } catch (err) { next(err); }
};
