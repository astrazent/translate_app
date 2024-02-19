const express = require('express');
const router = express.Router();
const {getHomePage, listUser, getUpdateUser, postCreateUser, postUpdateUser, test} = require('../controllers/homeController');

//Khai báo route
router.get('/', getHomePage); //getHomePage chi la tham chieu, khong thuc thi tai day => khong dung getHomePage()
router.get('/list', listUser);
router.get('/update/:id', getUpdateUser);
router.post('/create-user', postCreateUser);
router.post('/update-user', postUpdateUser);
router.get('/test', test);
module.exports = router; //export variable