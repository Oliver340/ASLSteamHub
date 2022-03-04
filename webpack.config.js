const webpack = require('webpack'); 

// replace accordingly './.env' with the path of your .env file 
require('dotenv').config({ path: './.env' }); 

const path = require('path');

module.exports = {
  entry: './js/allPages.js',
  output: {
    path: path.resolve(__dirname + "/js"),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    }),
  ]
};