const express = require('express');
const router = express.Router();

const {
  register,
  login,
  updateUser,
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authMiddleware, updateUser);

module.exports = router;
