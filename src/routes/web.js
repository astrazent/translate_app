const express = require('express');
const router = express.Router();
const {getHomePage, loginPage, registerPage, loginCheckPage, aboutPage, translatePage, translateHistory, translateList, translateUpdateKey, favoriteList, translateDeleteKey, DeleteFavoriteKey, flashcardPage} = require('../controllers/homeController');
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
router.post('/translate-history', translateHistory);
router.post('/translate-update-key', translateUpdateKey);
router.post('/translate-delete-key', translateDeleteKey);
router.post('/delete-favorite-key', DeleteFavoriteKey);
router.get('/translate-list', translateList);
router.get('/translate-favorite-list', favoriteList);
router.get('/flashcard', loggedIn, flashcardPage);
module.exports = router; //export variable