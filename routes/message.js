const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { allMessages, sendMessage } = require('../controllers/message');

const router = express.Router();

router.route('/').post(checkAuth, sendMessage);
router.route('/:chatId').get(checkAuth, allMessages);

module.exports = router;
