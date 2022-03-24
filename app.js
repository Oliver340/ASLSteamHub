//*******SETUP PORTION*******//

// Import the functions you need from the SDKs you need
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const { randomUUID } = require('crypto');

const server = express();
const port = 4757;
const updir = '..';
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

server.use('/html', express.static(path.join(__dirname, "html")));
server.use('/css', express.static(path.join(__dirname, "css")));
server.use('/images', express.static(path.join(__dirname, "images")));
server.use('/js', express.static(path.join(__dirname, "js")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.engine('html', require('ejs').renderFile);


//*******MAIN CLIENT PORTION*******//

server.get('/', (req, res) => {
  // looks in base path /views by default, either change filedir or do it like this
  res.render(updir + '/html/wordSubmission.html');
});


//*******MAIN API PORTION*******//

server.post('/api/signup', (req, res) => {
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

server.post('/api/signIn', (req, res) => {
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

server.post('/api/lists', (req, res) => {
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

server.post('/api/addWord', (req, res) => {
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

server.get('/api/library', (req, res) => {
    let permission = validate(req.body.token);
    if (permission) {
        connection.query(`SELECT Word, PlainDef, TechDef, VideoLink FROM Word WHERE Status = APPROVED`, (err, result) => {
            res.json(result);
        });
    }
});

server.post('/api/admin', (req, res) => {
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

server.post('/api/settings', (req, res) => {
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

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
