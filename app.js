//*******SETUP PORTION*******//

// Import the functions you need from the SDKs you need
const express = require('express');
const path = require('path');
const server = express();
const port = 4757;
const updir = '..';

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
    
    const password = bcrypt.hash(req.body.password, saltRounds, (err, salt) => {
        connection.query(`INSERT INTO Users ('Email', 'Password', 'Full Name') VALUES ('${email}', '${password}', '${name}');`, (err, result) => {
            if (err) throw err;
            let token = generateLoginToken();
            connection.query(`UPDATE Users SET 'Login Token' = ${token} WHERE 'Email' = '${email}'`, (err, result) => {
                if (err) throw err;
                connection.query(`INSERT INTO Players ('Player ID', 'Full Name', 'DOB', 'Sex', 'Skill Level', 'Allergies/Medication', 'Emergency Contact Number', 'Email')
                    VALUES (NULL, ${name}, ${dateOfBirth}, ${sex}, ${skill}, ${allergies}, ${emergency}, ${email});`, (err, result) => {
                    if (err) throw err;
                    res.send({
                        code: 200,
                        message: token
                    });
                });
            });
        });
    });
} catch {
    res.send({
        code: 400,
        message: "An error occurred. :("
    });
}
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
