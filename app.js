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
  let q = req.body;

  // req.body contains the passed json object, can access as q['x'] or q.x
  // firebase auth stuff goes here
  res.send({ help: false });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
