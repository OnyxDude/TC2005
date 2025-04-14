const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const db = require('../util/database'); 
router.get('/signin', authController.getSignIn);
router.post('/signin', authController.postSignIn);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);
router.post('/logout', authController.postLogout);

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
   

    const [user] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
    if (user.length > 0) {
        const [roles] = await db.query('SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?', [user[0].id]);
        req.session.userRole = roles.length > 0 ? roles[0].name : 'guest';
        req.session.userId = user[0].id;
    } else {
        req.session.userRole = 'guest';
    }

    req.session.isLoggedIn = true;
    req.session.userName = username;
    res.redirect('/');
});

module.exports = router;