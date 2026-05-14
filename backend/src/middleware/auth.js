const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {

  try {

    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      token = req.headers.authorization.split(' ')[1];
    }

    // No token
    if (!token) {

      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {

      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user
    req.user = user;

    next();

  } catch (err) {

    console.error(err);

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};