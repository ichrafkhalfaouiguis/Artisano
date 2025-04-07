
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import { sendVerificationEmail, sendResetEmail } from '../nodemailer.js';

import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const initiatePasswordReset = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the user with the given email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique token using JWT
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Store the token in the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    // Send the reset email
    const resetLink = `https://romisartsshops.onrender.com/updatepsw/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    return res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    next(error);
  }
});


export const updatePassword = asyncHandler(async (req, res, next) => {
  const resetToken = req.params.token;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Check if the token is expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    // Find user by ID in the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
});



// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password)) && user.isEmailVerified) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Generate verification code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let activationCode = '';

  for (let i = 0; i < 10; i++) {
    activationCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create a new user with verification code
  const user = await User.create({
    name,
    email,
    password,
    activationCode: activationCode,
  });

  if (user) {
    // Generate token and send activation email
    generateToken(res, user._id);
    await sendVerificationEmail(user.email, user.activationCode); 

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});



// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const verifyuser = asyncHandler(async (req, res) => {
  try {
    const foundUser = await User.findOne({ activationCode: req.params.activationCode });

    if (!foundUser) {
      return res.status(404).json({
        message: "False activation code",
      });
    }

    foundUser.isEmailVerified = true;
    await foundUser.save();

    return res.json({
      message: "Account activated successfully!",
    });
  } catch (error) {
    console.error('Error during activation:', error.message);
    return res.status(500).json({
      message: "Error during activation. Please try again.",
    });
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyuser,
  







};