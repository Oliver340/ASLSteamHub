const app = require('./app');
const http = require('http');

http.createServer(app).listen(process.env.PORT || 32535, () => {
    console.log(`listening on port ${process.env.PORT || 32535}`);
});