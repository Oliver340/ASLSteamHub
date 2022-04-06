const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require("jsonwebtoken");

const saltRounds = 12;
const secretKey = "X0x1fAHRJojFrRGw16XJ";
// const connection = mysql.createConnection({
//     host: "localhost:3306",
//     user: "antoi_aslsteam",
//     password: "1D1^o2or",
//     database: "antoinette_jackson_bcit_ca_aslsteamhub "
// });
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "aslsteamhub"
});
connection.connect();

module.exports = (router) => {
    //*******MAIN API PORTION*******//

    router.post('/api/signup', (req, res) => {
        try {
            const email = req.body.email;
            const name = req.body.name;

            bcrypt.hash(req.body.password, saltRounds, (err, salt) => {
                connection.query(`INSERT INTO User (UserID, FullName, Email, Password) VALUES (UUID(), '${name}', '${email}', '${salt}');`, (err, result) => {
                    if (err) throw err;
                    connection.query(`SELECT Permissions, UserID FROM User WHERE Password = '${salt}'`, (err, resp) =>{
                        if (err) throw err;
                        res.json({
                            token: jwt.sign({
                                Permissions: resp[0].Permissions,
                                UserID: resp[0].UserID
                            }, secretKey, {
                                expiresIn: "12h",
                            })
                        });
                    })
                });
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: e.message
            });
        }
    });

    router.post('/api/signIn', (req, res) => {
        try {
            connection.query(`SELECT Password, Permissions, UserID FROM User WHERE Email = '${req.body.email}'`, (e, r) => {
                if (e) throw e;
                if (bcrypt.compareSync(req.body.password, r[0].Password)) {
                    let token = {
                        token: jwt.sign({
                            Permissions: r[0].Permissions,
                            UserID: r[0].UserID
                        }, secretKey, {
                            expiresIn: "12h",
                        })
                    }
                    res.json(token);
                } else {
                    res.status(500);
                    res.json({
                        message: "Incorrect password"
                    })
                }
            });
        } catch (e) {
            res.status(500);
            res.json({
                message: "Incorrect email or password"
            });
        }
    });

    router.get('/api/getList', (req, res) => {
        try {
            connection.query(`SELECT Word.Word, Word.PlainDef, Word.TechDef, Word.VideoLink, List.ListName, Word.WordID
                FROM Word 
                LEFT JOIN LinkedList ON Word.WordID = LinkedList.WordID
                LEFT JOIN List ON List.ListID = LinkedList.ListID
                WHERE List.ListID='${req.query.listID}'`, (err, result) => {
                        if (err) throw err;

                        res.json(result);
                    });
        } catch (e) {
            res.status(500);
            res.json({
                message: "An error occured"
            })
        }
    });

    router.post('/api/editList', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                if (req.body.operation == "ADD") {
                    connection.query(`INSERT INTO LinkedList (ListID, WordID) VALUES ('${req.body.ListID}', '${req.body.WordID}')`, (err, response) => {
                        try {
                            if (err) throw err;
                            res.status(201);
                            res.json({
                                message: "Word added successfully"
                            });
                        } catch (e) {
                            res.status(500);
                            res.json({
                                message: e.message
                            });
                        }
                    });
                } else if (req.body.operation == "DELETE") {
                    //delete word
                    connection.query(`DELETE FROM LinkedList WHERE WordID='${req.body.WordID}' AND ListID='${req.body.ListID}'`, (err, response) => {
                        try {
                            if (err) throw err;
                            res.status(201);
                            res.json({
                                message: "Word deleted successfully"
                            });
                        } catch {
                            res.status(500);
                            res.json({
                                message: "Could not update database"
                            });
                        }
                    });
                } else if (req.body.operation == "UPDATE") {
                    //edit list name
                    connection.query(`UPDATE List SET ListName='${req.body.ListName}' WHERE ListID='${req.body.ListID}'`, (err, response) => {
                        try {
                            if (err) throw err;
                            res.status(201);
                            res.json({
                                message: "List updated successfully"
                            });
                        } catch {
                            res.status(500);
                            res.json({
                                message: "Could not update database"
                            });}
                    });
                }
            } else {
                res.status(500);
                res.json({
                    message: "User must be logged in"
                });
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Could not update database"
            });
        }
    });
    
    router.get('/api/library', (req, res) => {
        try{
            if (req.query.listID) {
                connection.query(`SELECT Word.Word, Word.PlainDef, Word.TechDef, Word.VideoLink, Word.WordID
                FROM Word
                WHERE Word.Status='APPROVED' AND WordID NOT IN (
                SELECT WordID FROM linkedlist WHERE ListID = '${req.query.listID}')`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            } else {
                connection.query(`SELECT Word, PlainDef, TechDef, VideoLink, WordID FROM Word WHERE Status='APPROVED'`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Could not get approved words"
            })
        }
    });
    
    router.post('/api/admin', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                if (permission.Permissions == "ADMIN") {
                    connection.query(`SELECT WordID, Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status='PENDING'`, (err, result) => {
                        if (err) throw err;
                        res.json(result);
                    });
                }
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Could not get pending words."
            })
        }
    });
    
    router.post('/api/profile', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                if (req.body.operation == "GET") {
                    connection.query(`SELECT FullName, Email FROM User WHERE UserID='${permission.UserID}'`, (err, result) => {
                        if (err) throw err;
                        res.json(result[0]);
                    });
                } else if (req.body.operation == "UPDATE") {
                    connection.query(`UPDATE User SET FullName='${req.body.FullName}', Email='${req.body.Email}' WHERE UserID='${permission.UserID}'`, (err, result) => {
                        if (err) throw err;
                        res.status(202);
                        res.json({
                            message: "Updated user successfully"
                        });
                    });
                }
            } else {
                res.status(500);
                res.json({
                    message: "User must be logged in"
                })
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Could not get or update user profile"
            })
        }
    });

    router.post('/api/createNewList', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                connection.query(`INSERT INTO List (ListID, UserID, ListName) VALUES (UUID(), '${permission.UserID}', '${req.body.ListName}')`, (err, result) => {
                    if (err) throw err;
                    connection.query(`SELECT ListID FROM List WHERE CreationDate=(SELECT MAX(CreationDate) FROM List)`, (err, result) => {
                        res.json([{
                            ListName: req.body.ListName,
                            ListID: result[0].ListID
                        }]);
                    });
                })
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Unable to create new list."
            })
        }
    });

    router.post('/api/modifyPendingWord', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                if (permission.Permissions == "ADMIN") {
                    if (req.body.operation == "APPROVE") {
                        connection.query(`UPDATE Word SET Status='APPROVED' WHERE WordID='${req.body.WordID}'`, (err, result) => {
                            if (err) throw err;
                            res.status(201);
                            res.json({
                                message: "Word successfully updated."
                            });
                        });
                    } else if (req.body.operation == "DENY") {
                        connection.query(`DELETE FROM Word WHERE WordID='${req.body.WordID}'`, (err, result) => {
                            if (err) throw err;
                            res.status(201);
                            res.json({
                                message: "Word successfully deleted."
                            });
                        });
                    } else if (req.body.operation == "UPDATE") {
                        connection.query(`UPDATE Word SET Word='${req.body.Word}', PlainDef='${req.body.PlainDef}', TechDef='${req.body.TechDef}', VideoLink='${req.body.VideoLink}', Status='${req.body.Status}' WHERE WordID='${req.body.WordID}'`, (err, result) => {
                            if (err) throw err;
                            res.status(202);
                            res.json({
                                message: "Word updated successfully"
                            })
                        });
                    }
                }
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Word unable to be updated"
            })
        }
    });

    router.post('/api/addWord', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                connection.query(`INSERT INTO Word (WordID, UserID, Word, PlainDef, TechDef, VideoLink) VALUES (UUID(), '${permission.UserID}', '${req.body.Word}', '${req.body.PlainDef}', '${req.body.TechDef}', '${req.body.VideoLink}')`, (err, result) => {
                    if (err) throw err;
                    res.json({
                        message: "Successfully added word to pending list."
                    });
                });
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Word unable to be Aadded"
            })
        }
    });

    router.post('/api/getUserLists', (req, res) => {
        try {
            let permission = validate(req.body.token);
            if (permission) {
                connection.query(`SELECT ListID, ListName FROM List WHERE UserID='${permission.UserID}'`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            }
            
        } catch (e) {
            res.status(500);
            res.json({
                message: "Unable to get user's lists"
            });
        }
    });

    router.get('/api/searchLibrary/:SearchTerm', (req, res) => {
        try {
            if (req.params.SearchTerm == "" || req.params.SearchTerm == undefined) {
                connection.query(`SELECT Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status='APPROVED'`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            } else {
                connection.query(`SELECT Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status='APPROVED' AND Word LIKE '%${req.params.SearchTerm}%'`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            }
        } catch (e) {
            res.status(500);
            res.json({
                message: "Unable to complete search"
            })
        }
    });
    
    let validate = (token) => {
        try {
            let response = jwt.verify(token, secretKey);
            return {
                Permissions: response.Permissions,
                UserID: response.UserID
            };
        } catch {
            return "Validation failed";
        }
    }
}