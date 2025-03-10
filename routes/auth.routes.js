const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);
router.post('/logout', authController.postLogout);

module.exports = router;