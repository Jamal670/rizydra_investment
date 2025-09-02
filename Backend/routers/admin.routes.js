const express = require('express');
const AdminDash = require('../controllers/AdminDash.controller');

const router = express.Router();

router.get('/adminGetAllUsers', AdminDash.AdminGetAllUsers);
router.get('/adminGetAllUsersdata', AdminDash.AdminGetAllUsersdata); 
router.get('/adminGetAllUsersDeposit', AdminDash.AdminGetAllDepositUsers);
router.post('/adminHandleDepositConfirmed', AdminDash.AdminHandleDepositConfirmed);
router.post('/adminHandleDepositDeclined', AdminDash.AdminHandleDepositDeclined);
router.get('/adminGetAllUsersWithdraw', AdminDash.AdminGetAllWithdrawUsers);
router.post('/adminHandleWithdrawConfirmed', AdminDash.AdminHandleWithdrawConfirmeds);
router.post('/adminHandleWithdrawDeclined', AdminDash.AdminHandleWithdrawDeclineds);
router.get('/adminGetSpecificUser/:id', AdminDash.adminGetSpecificUsers);
router.get('/admincontactus', AdminDash.admincontactUs);


module.exports = router;
 