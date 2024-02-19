const connection = require('../config/database');

const getHomePage = (req, res) => {
    return res.render('home.ejs') 
}

const listUser = async (req, res) => {  
    let [results, fields] = await connection.query(`SELECT * FROM Persons`);
    return res.render('listUser.ejs', {listUsers: results}) 
}
const getUpdateUser = async (req, res) => {
    const userid = req.params.id;
    let [results, fields] = await connection.query(`SELECT * FROM Persons WHERE PersonID = ?`, [userid]);
    let user = results && results.length > 0 ? results[0] : {};
    return res.render('update.ejs', {userEdit: user}) 
}

const postCreateUser = async (req, res) => {
    let {fname, lname, address, city} = req.body;

    // Using placeholders
    const [results, fields] = await connection.query(
    `INSERT INTO 
    Persons (Firstname, Lastname, Address, City) 
    VALUES (?, ?, ?, ?)`, [fname, lname, address, city]
    );  
    res.send('create user success!');
}
const postUpdateUser = async (req, res) => {
    let {id, fname, lname, address, city} = req.body;
    const [results, fields] = await connection.query(
    `UPDATE Persons
    SET Firstname = ?, Lastname = ?, Address = ?, City = ? 
    WHERE PersonID = ?`, [fname, lname, address, city, id]
    );  
    console.log(id, fname, lname, address, city);
    res.redirect('/');
}
    const test = (req, res) => {
        return res.render('test.ejs');
    }
module.exports = {
    getHomePage, listUser, postCreateUser, getUpdateUser, postUpdateUser, test // export object
}