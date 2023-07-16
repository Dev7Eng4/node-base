const asyncHandler = require('express-async-handler');

const User = require('../models/user');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all this fields.');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: user.generateAccessToken(),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create the user');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all this fields');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      // _id: user._id,
      // name: user.name,
      // email: user.email,
      // pic: user.pic,
      access_token: user.generateAccessToken(),
      refresh_token: '',
      token_type: 'Bearer',
      expired_in: Date.now() + 3 * 24 * 60 * 60 * 1000,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const search = req.query.search;
  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  console.log('aaa');
  if (!req.user) {
    res.send(404);
    throw new Error('User not found');
  }

  res.json(req.user);
});

const fetchUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.send(404);
    throw new Error('User not found!');
  }

  res.json(user);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  fetchUserInfo,
  getCurrentUser,
};
