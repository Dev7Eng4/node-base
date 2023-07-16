const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const checkAuth = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ err: 'Please authentication.' });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode._id);

    if (!user) {
      return res.status(500).send({ err: 'User not exists. ' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ err: 'Please authentication.' });
  }
});

module.exports = {
  checkAuth,
};
