const express = require('express');
const authUser = require('../controllers/Authentication.controller');
const authMiddleware = require('../controllers/middleware/authMiddleware');

const router = express.Router();

router.post('/UserRegister', authUser.RegUser);
router.put('/VerifyOtp/:id', authUser.VerifyOtp);
router.put('/resendOtp/:id', authUser.ResendOtp);
router.post('/Login', authUser.Login);
router.post('/forgotPassSendOtp', authUser.ForgotPassSendEmail);
router.put('/forgotpass/:id', authUser.ForgotPass);
router.get('/logout', authUser.Logout);
router.get('/verify-auth', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Token valid', user: req.user });
});

module.exports = router;
 