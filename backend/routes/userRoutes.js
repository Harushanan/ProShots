const express = require('express');
const { loginuser, signupuser, updateuserpw, displayuser , deleteuser , displaydeletuser , addAdmin ,displayadmin , deleteaccount , updateprofile, checkregister , SentOTP , verifyOTP , getuserdeatiles , sendotpchangepassword , verifyotpchangepassword , adduser , checkupdateuserpw } = require('../controls/userController');

const router = express.Router();
 
//-------- UserMangement Routes ------------------//
router.post('/login', loginuser);
router.post('/register', signupuser);
router.post('/forgotpassword', updateuserpw);
router.get('/studentdeatiles', displayuser);
router.get('/deletuserdeatiles',displaydeletuser)
router.post('/deleteuser', deleteuser);
router.post('/deleteaccount',deleteaccount)
router.post('/addAdmin', addAdmin);
router.get('/displayadmin',displayadmin)
router.post('/updateprofile',updateprofile)


router.post('/checkregister',checkregister)
router.post('/send-otp',SentOTP)
router.post('/send-otpchangepassword',sendotpchangepassword)
router.post('/verify-otpchangepassword',verifyotpchangepassword)
router.post('/verify-otp',verifyOTP)
router.get('/getuserdeatiles',getuserdeatiles)
router.post('/adduser', adduser);
router.post('/checkupdateuserpw',checkupdateuserpw)
//------------------------------------------------//


module.exports = router; 