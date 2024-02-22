const jwt = require('jsonwebtoken');
const connection = require('../config/database');

require('dotenv').config();

const loggedIn = async (req, res, next) => {
    if(!req.cookies.userRegistered) return next();
    try{
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        const [results, fields] = await connection.query('SELECT * FROM Users WHERE ID = ?', [decoded.id]);
        req.user = results[0];
        return next();
    }
    catch{
        return next();
    }
}
module.exports = {loggedIn};
