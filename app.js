//*******SETUP PORTION*******//

// server-size firebase has, for better or for worse, been nuked on the server side.
// future implementations should probably use a local database for storage and
// user data.
// Basically, plesk npm intaller doesn't use the typical 'npm' alias for using 
// npm, and the main-js module that firebase uses requires that command to have that alias.
// You can use firebase if you can get around that, but as of right now, firebase 
// absolutely cannot be properly installed onto plesk. Uploading a separate node-modules
// file doesn't seem to work either, but ymmv.

// Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app");
// const { getFirestore, collection, getDocs } = require("firebase/firestore/lite");
//const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = require('./keys/firebaseconfig.json');

// Initialize Firebase
// const firebaseapp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseapp);
// const analytics = getAnalytics(firebaseapp);
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

server.get('/category', (req, res) => {
  res.render(updir + '/public/category.html');
});

server.get('/dashboard', (req, res) => {
  res.render(updir + '/public/dashboard.html');
});

server.get('/editList', (req, res) => {
  res.render(updir + '/public/editList.html');
});

server.get('/game', (req, res) => {
  res.render(updir + '/public/game.html');
});

server.get('/list', (req, res) => {
  res.render(updir + '/public/list.html');
});

server.get('/search/:term', (req, res) => {
  res.render(updir + '/public/searchResults.html');
});

server.get('/word/:word', (req, res) => {
  res.render(updir + '/public/wordPage.html');
});

server.get('/submitword', (req, res) => {
  res.render(updir + '/public/wordSubmission.html');
});

//*******MAIN API PORTION*******//

server.post('/api/signup', (req, res) => {
  let q = req.body;

  // req.body contains the passed json object, can access as q['x'] or q.x
  // firebase auth stuff goes here
  res.send({ help: false });
});


module.exports = app;