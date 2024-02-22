const express = require('express');
const router = express.Router();
const {getHomePage, listUser, getUpdateUser, postCreateUser, postUpdateUser, test, loginPage, registerPage, loginCheckPage} = require('../controllers/homeController');
const {loggedIn} = require('../controllers/checkLogin');
const {logOut} = require('../controllers/logOut');

//Khai báo route
router.get('/', loggedIn, getHomePage); //getHomePage chi la tham chieu, khong thuc thi tai day => khong dung getHomePage()
router.get('/logout', logOut); //getHomePage chi la tham chieu, khong thuc thi tai day => khong dung getHomePage()
router.get('/list', listUser);
router.get('/update/:id', getUpdateUser);
router.post('/create-user', postCreateUser);
router.post('/update-user', postUpdateUser);
router.get('/test', test);
router.get('/login', loginPage);
router.post('/register', registerPage);
router.post('/check-login', loginCheckPage);
module.exports = router; //export variable