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
                    connection.query(`SELECT Permissions FROM User WHERE Password = '${salt}'`, (err, resp) =>{
                        console.long
                        res.json(jwt.sign({
                            password: salt,
                            admin: resp
                        }, secretKey, {
                            expiresIn: "12h",
                        }));
                    })
                });
            });
        } catch {
            res.json({
                code: 400,
                message: "An error occurred. :("
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
        } catch {
            res.json({
                code: 400,
                message: "Something went wrong"
            });
        }
    });

    router.post('/api/lists', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            //Look for words
            connection.query(`SELECT Word.Word, Word.PlainDef, Word.TechDef, Word.VideoLink, List.ListID
                FROM Word 
                LEFT JOIN LinkedList ON Word.WordID = LinkedList.WordID
                LEFT JOIN List ON List.ListID = LinkedList.WordID
                WHERE List.UserID = ${permission.UserID}`, (err, result) => {
                        if (err) throw err;
                        res.json(result);
                    });
        }
    });

    router.post('/api/addWord', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            connection.query(`INSERT INTO LinkedList (ListID, WordID) VALUES (${permission.ListID}, ${permission.WordID})`, (req, res) => {
                res.json({
                    code: 200,
                    message: "Word added successfully"
                });
            });
        }
    })
    
    router.get('/api/library', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            connection.query(`SELECT Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status = APPROVED`, (err, result) => {
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
    
    router.post('/api/settings', (req, res) => {
        let permission = validate(req.body.token);
        if (permission) {
            //Update user data
        }
    });
    
    let validate = (token) => {
        try {
            let response = jwt.verify(token, secretKey);
            return {
                permissions: response.Permissions,
                id: response.UserID
            };
        } catch {
            return "Validation failed";
        }
    }
}