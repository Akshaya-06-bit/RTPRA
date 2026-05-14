const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign(
    { _id: id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

exports.register = async (req, res, next) => {

  try {

    console.log("REGISTER BODY:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (err) {

    console.log("REGISTER ERROR:", err);

    next(err);
  }
};

exports.login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (err) {

    console.log("LOGIN ERROR:", err);

    next(err);
  }
};

exports.getMe = (req, res) => {

  res.json({
    success: true,
    user: req.user
  });
};