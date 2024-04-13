const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getHomePage = (req, res) => {
    if(req.user){
        return res.render('home_main.ejs', {status:"LoggedIn", user: req.user}); 
    }
    else{
        return res.render('home_main.ejs', {status:"LoggedOut"})
    }
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

const test = async (req, res) => {
    // const password = await bcrypt.hash("aaa", 8);
    // if(await bcrypt.compare("aaa", password)) console.log('false');
    console.log(new Date(Date.now()))
    console.log("OK")
    return res.render('test.ejs');
}

const loginPage = (req, res) => {
    return res.render('login_main.ejs');
}

const registerPage =  async (req, res) => {
    let {registerName, registerEmail, registerPassword} = req.body;
    if(!registerEmail || !registerPassword) return res.json({status: "error", message: "Please enter your infomation"});
    else{
        const [results, fields] = await connection.query('SELECT * FROM Users WHERE Name = ? OR Email = ?', [registerName, registerEmail]);
        if(results[0]) return res.json({status: "error", message: "information has already used"})
        else{
            try{
                const password = await bcrypt.hash(registerPassword, 8);
                const [results, fields] = await connection.query('INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ? )', [registerName, registerEmail, password]);
                return res.json({status: "success", message: "Register success!"});
            }
            catch(err){
                console.log(err);
            }
        }
    }
    
}

const loginCheckPage = async (req, res) => {
    let {loginEmail, loginPassword} = req.body;
    if(!loginEmail || !loginPassword) return res.json({status: "error", message: "Please enter your Email or Password"});
    else{
        const [results, fields] = await connection.query('SELECT * FROM Users WHERE Email = ?', [loginEmail]);
        if(!results[0] || !await bcrypt.compare(loginPassword, results[0].Password)) return res.json({status: "error", message: "Incorrect Email or Password"})
        else{
            const token = jwt.sign({id: results[0].ID}, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            })
            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.COOKIES_EXPIRE * 86400 * 1000),
                httpOnly: true
            }
            res.cookie("userRegistered", token, cookiesOptions);
            return res.json({status: "success", message: "Login success!"});
        }
    }
}
const aboutPage = (req, res) => {
    if(req.user){
        return res.render('about.ejs', {status:"LoggedIn", user: req.user}); 
    }
    else{
        return res.render('about.ejs', {status:"LoggedOut"})
    }
}

const translatePage = (req, res) => {
    if(req.user){
        return res.render('translate.ejs', {status:"LoggedIn", user: req.user}); 
    }
    else{
        return res.render('login_main.ejs');
    }
    // if(req.user){
    //     return res.render('translate.ejs', {status:"LoggedIn", user: req.user}); 
    // }
    // else{
    //     return res.render('translate.ejs', {status:"LoggedOut"})
    // }
}

const translateHistory = async (req, res) => {
    let {translateFrom, translateToText, languageFrom, languageTo} = req.body;
    const [results, fields] = await connection.query(
        `INSERT INTO 
        TranslateHistory (FavoriteId, LanguageFrom, LanguageTo, TranslateFrom, TranslateTo) 
        VALUES (?, ?, ?, ?, ?)`, ['0', languageFrom, languageTo, translateFrom, translateToText]
        );
        return res.json({status: 'success', message: 'Save success'})  
}

const translateList = async (req, res) => {
    let [results, fields] = await connection.query(`SELECT * FROM TranslateHistory`);
    if(!results.length) return res.json({})
    return res.json(results) 
}

const translateUpdateKey = async (req, res) => {
    let {check, id} = req.body
    if(check){
        //cập nhật trạng thái favorite của từ
        await connection.query(`INSERT INTO TranslateFavorite (History_id, LanguageFrom, LanguageTo, TranslateFrom, TranslateTo)
        SELECT History_id, LanguageFrom, LanguageTo, TranslateFrom, TranslateTo
        FROM TranslateHistory
        WHERE History_id = ?`, [id])
        await connection.query(`UPDATE TranslateHistory SET FavoriteId  = '1' WHERE History_id = ?`, [id])
    }
    else{
        await connection.query(`DELETE FROM TranslateFavorite WHERE History_id = ?`, [id]);
        await connection.query(`UPDATE TranslateHistory SET FavoriteId  = '0' WHERE History_id = ?`, [id]);
    }
    return res.json({status: 'success', message: 'Update success'}) 
}

const favoriteList = async (req, res) => {
    let [results, fields] = await connection.query(`SELECT * FROM TranslateFavorite`);
    return res.json(results) 
}

const translateDeleteKey = async (req, res) => {
    let {id} = req.body;
    await connection.query(`DELETE FROM TranslateHistory WHERE History_id = ?`, [id]);
    return res.json({status: 'success', message: 'Delete history list success'}) 
}

const DeleteFavoriteKey = async (req, res) => {
    let {favorId, hisId} = req.body;
    await connection.query(`DELETE FROM TranslateFavorite WHERE Favorite_id = ?`, [favorId]);
    if(hisId){
        await connection.query(`UPDATE TranslateHistory SET FavoriteId  = '0' WHERE History_id = ?`, [hisId]);
    }
}

const flashcardPage = (req, res) => {
    if(req.user){
        return res.render('flashcard.ejs', {status:"LoggedIn"}); 
    }
    else{
        return res.render('login_main.ejs');
    }
}

const createFlashCard = async (req, res) => {
    //nhận dữ liệu từ frontend
    let {tI, tTN, tDN} = req.body;

    //check null
    if(!tI || tTN.includes("") || tDN.includes("")) return res.json({status: "error", message: "Please not miss any field!"});

    //thêm tiêu đề và flashcardtitle
    const [result_title, fields_title] = await connection.query(`INSERT IGNORE INTO FlashCardTitle (Name, TotalItem, TitleDate) VALUES (?, ?, ?)`, [tI, tTN.length, dateNow()]);
    if(!result_title.affectedRows) return res.json({status: "error", message: "Duplicate flashcard title"});
    const [rslt, flds] = await connection.query(`SELECT Title_Id FROM FlashCardTitle WHERE Name = ?`, [tI]);
    if(!rslt[0]) return res.json({status: "error", message: "Get title id Failed"});

    // tạo bảng flashcard
    var titleId = rslt[0].Title_Id;
    var flashcard_Table = "FlashCards_" + titleId;
    var constrain_key = "fk_Title_id_" + titleId;
    const [result_create, fields_create] = await connection.query(`
    CREATE TABLE `+ flashcard_Table + ` (
        Flashcard_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        Title_Id INT,
        TermTN VARCHAR(255) NOT NULL,
        TermDN VARCHAR(255) NOT NULL,
        CONSTRAINT `+ constrain_key + ` FOREIGN KEY (Title_Id) REFERENCES FlashCardTitle(Title_Id)
        ON UPDATE SET NULL
        ON DELETE SET NULL
    );`);
    if(!result_create.serverStatus) return res.json({status: "error", message: "Create flashcard Failed"});

    //add từ vựng vào flashcard
    const createSql = (tTN, tDN) => {
        var sql = 'INSERT INTO ' + flashcard_Table + ' (Title_Id, TermTN, TermDN) VALUES ';
        //lấy ra title id
        for(i = 0; i < tTN.length; i++){
            sql += '(' + '"' + titleId + '"' + ', ' + '"' + tTN[i] + '"' + ', ' + '"' + tDN[i] + '"' + ')'
            if(i != tTN.length - 1) sql += ', '
        }
        return sql;
    }
    if(tTN.length != tDN.length) return res.json({status: "error", message: "Missing required field!"});
    const [result_add, fields_add] = await connection.query(createSql(tTN, tDN));
    if(!result_add.affectedRows) return res.json({status: "error", message: "Add flashcard Failed"});

    return res.json({status: "success", message: "Create flashcard success!"});
}

const getFlashCardList = async (req, res) => {
    const [results, fields] = await connection.query(`
    SELECT *,
    DATE_FORMAT(TitleDate, '%d-%m-%y %H:%i:%s') AS formated_time
    FROM FlashCardTitle
    ORDER BY formated_time DESC`);
    return res.json(results);
}

const deleteFlashcard = async (req, res) => {
    let {deleteId} = req.body;
    const [results, fields] = await connection.query(`DELETE FROM FlashCardTitle WHERE Title_Id = ?`, [deleteId]);
    const [rslts, flds] = await connection.query(`DROP TABLE IF EXISTS FlashCards_` + deleteId);
    if(!results.affectedRows) return res.json({status: "error", message: "Delete flashcard title Failed"});
    if(!rslts.serverStatus) return res.json({status: "error", message: "Delete flashcard List Failed"});
    return res.json({status: "success", message: "Delete flashcard success"});
}
const getEditFlashcard = async (req, res) => {
    let {editId} = req.params;
    // lấy tiêu đề
    const [results, fields] = await connection.query(`SELECT Name FROM FlashCardTitle WHERE Title_Id = ?`, [editId]);
    if(!results[0]) return res.json({status: "error", message: "Get flashcard title Failed"});

    //lấy dữ liệu 
    const [rslts, flds] = await connection.query(`SELECT * FROM FlashCards_` + editId);
    if(!rslts[0]) return res.json({status: "error", message: "Add flashcard List Failed"});
    return res.json({titleName: results[0], flashcards: rslts});
}
const EditFlashcard = async (req, res) => {
    let {flashcardId, editId, name, tTN, tDN} = req.body;
    //sửa tiêu đề
    const [results, fields] = await connection.query(`UPDATE FlashCardTitle SET Name = ?, TotalItem = ?, TitleDate = ? WHERE Title_Id = ?;`, [name, tTN.length, dateNow(), editId]);
    if(!results.affectedRows) return res.json({status: "error", message: "Edit flashcard title Failed"});

    // add từ vựng vào flashcard
    const editSql = (editId, tTN, tDN) => {
        var sql = `INSERT INTO FlashCards_` + editId + ` (FlashCard_id, Title_Id, TermTN, TermDN) VALUES `;
        //lấy ra title id
        for(i = 0; i < tTN.length; i++){
            sql += "(" + flashcardId[i] + ', ' + editId + ', ' + '"' + tTN[i] + '"' + ', ' + '"' + tDN[i] + '")';
            if(i != tTN.length - 1) sql += ', '
        }
        sql += ` ON DUPLICATE KEY UPDATE Flashcard_id = VALUES (Flashcard_id),
        Title_Id = VALUES (Title_Id),
        TermTN = VALUES (TermTN), TermDN = VALUES (TermDN)`
        return sql;
    }
    const deleteSql = (editId) => {
        var sql = `DELETE FROM FlashCards_` + editId + ` WHERE Title_Id = ` + editId + " AND Flashcard_id NOT IN (";
        for(i = 0; i < flashcardId.length; i++){
            sql += flashcardId[i];
            if(i != flashcardId.length - 1) sql += ', ';
            if(i == flashcardId.length - 1) sql += ')';
        }
        return sql;
    }
    //sửa dữ liệu trong bảng
    const [rslts, flds] = await connection.query(editSql(editId, tTN, tDN));
    const [rsts, fds] = await connection.query(deleteSql(editId));
    if(!rslts.affectedRows || !rsts.serverStatus) return res.json({status: "error", message: "Edit flashcard List Failed"});
    return res.json({status: "success", message: "Edit flashcard success"});
}
const flashcardPageDetail = async (req, res) => {
    if(req.user){
        return res.render('flashcardDetail.ejs', {status:"LoggedIn", user: req.user}); 
    }
    else{
        return res.render('login_main.ejs');
    }
}
const getFlashcard = async (req, res) => {
    let {id} = req.params;
    // lấy tiêu đề
    const [results, fields] = await connection.query(`SELECT Name FROM FlashCardTitle WHERE Title_Id = ?`, [id]);
    if(!results[0]) return res.json({status: "error", message: "Get flashcard title Failed"});

    //lấy dữ liệu 
    const [rslts, flds] = await connection.query(`SELECT * FROM FlashCards_` + id);
    if(!rslts[0]) return res.json({status: "error", message: "Add flashcard List Failed"});
    return res.json({titleName: results[0], flashcards: rslts});
}

// ===================== REUSE FUNCTION ===================================
const dateNow = () =>{
    var currentDate = new Date();

    // Lấy ngày, tháng, năm
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Tháng bắt đầu từ 0 nên cần cộng 1
    var day = ('0' + currentDate.getDate()).slice(-2);

    // Lấy giờ, phút, giây
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);

    // Tạo chuỗi kết quả
    var formattedDateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDateTime;
}
module.exports = {
    getHomePage, listUser, postCreateUser, getUpdateUser, postUpdateUser, test, loginPage, registerPage, loginCheckPage, aboutPage, translatePage, translateHistory, translateList, translateUpdateKey, favoriteList, translateDeleteKey, DeleteFavoriteKey, flashcardPage, createFlashCard, getFlashCardList, deleteFlashcard, EditFlashcard, getEditFlashcard, getFlashcard, flashcardPageDetail // export object
}