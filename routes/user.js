const express = require('express');
const {
  allUsers,
  fetchUserInfo,
  getCurrentUser,
} = require('../controllers/user');
const { checkAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(checkAuth, allUsers);
router.route('/current-user').get(checkAuth, getCurrentUser);
router.route('/:userId').get(checkAuth, fetchUserInfo);

module.exports = router;
