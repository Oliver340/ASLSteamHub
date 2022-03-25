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
                        console.log(resp);
                        res.json(jwt.sign({
                            Permissions: resp.Permissions,
                            UserID: resp.UserID
                        }, secretKey, {
                            expiresIn: "12h",
                        }));
                    })
                });
            });
        } catch (e){
            res.json({
                code: 400,
                message: e.message
            });
        }
    });

    router.post('/api/signIn', (req, res) => {
        try {
            connection.query(`SELECT Password, Permissions, UserID FROM User WHERE Email = '${req.body.email}'`, (e, r) => {
                if (e) throw e;
                if (bcrypt.compareSync(req.body.password, r[0].Password)) {
                    res.json(jwt.sign(JSON.parse(JSON.stringify(r[0])), secretKey, {
                        expiresIn: "12h",
                    }));
                }
            });
        } catch (e) {
            res.json({
                code: 400,
                message: e.message
            });
        }
    });

    router.post('/api/getList', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            //Look for words
            connection.query(`SELECT Word.Word, Word.PlainDef, Word.TechDef, Word.VideoLink, List.ListName
                FROM Word 
                LEFT JOIN LinkedList ON Word.WordID = LinkedList.WordID
                LEFT JOIN List ON List.ListID = LinkedList.WordID
                WHERE List.ListID = ${req.body.ListID}`, (err, result) => {
                        if (err) throw err;
                        res.json(result);
                    });
        }
    });

    router.post('/api/editList', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            if (req.body.operation == "ADD") {
                connection.query(`INSERT INTO LinkedList (ListID, WordID) VALUES ('${req.body.ListID}', '${req.body.WordID}')`, (req, res) => {
                    res.json({
                        code: 200,
                        message: "Word added successfully"
                    });
                });
            } else if (req.body.operation == "DELETE") {
                //delete word
                connection.query(`DELETE FROM LinkedList WHERE WordID=${req.body.WordID}, ListID=${req.body.ListID}`, (err, response) => {
                    res.json({
                        code: 200,
                        message: "Word deleted successfully"
                    });
                });
            } else if (req.body.operation == "UPDATE") {
                //edit list name
                connection.query(`UPDATE List SET ListName=${req.body.ListName} WHERE ListID=${req.body.ListID}`, (err, response) => {
                    res.json({
                        code: 200,
                        message: "List updated successfully"
                    });
                });
            }
        }
    })
    
    router.get('/api/library', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            connection.query(`SELECT Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status=APPROVED`, (err, result) => {
                res.json(result);
            });
        }
    });
    
    router.post('/api/admin', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            if (permission.Permissions == "ADMIN") {
                connection.query(`SELECT WordID, Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status = PENDING`, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
            }
        }
    })
    
    router.post('/api/profile', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            if (req.body.operation == "GET") {
                connection.query(`SELECT FullName, Email FROM User WHERE UserID=${permission.UserID}`, (err, result) => {
                    res.json(result);
                });
            } else if (req.body.operation == "UPDATE") {
                connection.query(`UPDATE User SET FullName=${req.body.FullName}, Email=${req.body.Email} WHERE UserID=${permission.UserID}`, (err, result) => {
                    res.json({
                        code: 200,
                        message: "Updated user successfully"
                    });
                });
            }
        }
    });

    router.post('/api/createNewList', (req, res) => {
        console.log(req.body);
        let permission = validate(req.body.token);
        if (permission) {
            connection.query(`INSERT INTO List (ListID, UserID, ListName) VALUES (UUID(), '${permission.UserID}', '${req.body.ListName}')`, (err, result) => {
                if (err) throw err;
                res.json({
                    code: 200,
                    message: "List successfully created"
                })
            })
        }
    })

    router.post('/api/modifyPendingWord', (req, res) => {
        let permission = validate(req.body.token)
        if (permission) {
            if (permission.Permissions == "ADMIN") {
                if (req.body.operation == "APPROVE") {
                    connection.query(`UPDATE Word SET Status=APPROVED WHERE WordID=${req.body.WordID}`);
                } else if (req.body.operation == "DENY") {
                    connection.query(`DELETE FROM Word WHERE WordID=${req.body.WordID}`);
                } else if (req.body.operation == "UPDATE") {
                    connection.query(`UPDATE Word SET Word=${req.body.Word}, PlainDef=${req.body.PlainDef}, TechDef=${req.body.TechDef}, VideoLink=${req.body.VideoLink}, Status=${req.body.Status} WHERE WordID=${req.body.WordID}`);
                }
            }
        }
    })
    
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