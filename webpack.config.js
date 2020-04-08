const path = require('path');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

require('@babel/register');

// determine working environment
const env = process.env.NODE_ENV;

const config = {
  target: 'node',
  externals: [nodeExternals()], // ignore all modules in node_modules
  // Entry
  entry: path.join(__dirname, 'src', 'server.js'),
  // Output
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  }, // Loaders
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }, // Plugins
  plugins: [
    // use dotenv to define process.env
    new Dotenv({
      path: `./src/config/.${env === 'production' ? 'pro' : 'dev'}.env`,
      safe: false
    })
  ]
};

module.exports = config;
