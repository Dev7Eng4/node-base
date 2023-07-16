const express = require('express');
const { checkAuth } = require('../middleware/auth');
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addMember,
  removeMember,
} = require('../controllers/chat');

const router = express.Router();

router.route('/').post(checkAuth, accessChat);
router.route('/groups').get(checkAuth, fetchChats);
router.route('/groups').post(checkAuth, createGroup);
router.route('/groups').put(checkAuth, renameGroup);
router.route('/groups/add-member').put(checkAuth, addMember);
router.route('/groups/remove-member').put(checkAuth, removeMember);

module.exports = router;
