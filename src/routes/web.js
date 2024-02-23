const express = require('express');
const router = express.Router();
const {getHomePage, loginPage, registerPage, loginCheckPage, aboutPage, translatePage} = require('../controllers/homeController');
const {loggedIn} = require('../controllers/checkLogin');
const {logOut} = require('../controllers/logOut');

//Khai báo route
router.get('/', loggedIn, getHomePage); //getHomePage chi la tham chieu, khong thuc thi tai day => khong dung getHomePage()
router.get('/logout', logOut); //getHomePage chi la tham chieu, khong thuc thi tai day => khong dung getHomePage()
router.get('/login', loginPage);
router.get('/about', loggedIn, aboutPage);
router.get('/translate', loggedIn, translatePage);
router.post('/register', registerPage);
router.post('/check-login', loginCheckPage);
module.exports = router; //export variable