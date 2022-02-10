//*******SETUP PORTION*******//

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore/lite");
//const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = require('./keys/firebaseconfig.json');

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);
//const analytics = getAnalytics(firebaseapp);
const express = require('express');
const path = require('path');
const server = express();
const port = 4757;
const updir = '..';

server.use('/public', express.static(path.join(__dirname, "public")));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.engine('html', require('ejs').renderFile);


//*******MAIN CLIENT PORTION*******//

server.get('/', (req, res) => {
  // looks in base path /views by default, either change filedir or do it like this
  res.render(updir + '/public/index.html');
});

server.get('/signin', (req, res) => {
  res.render(updir + '/public/signIn.html');
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