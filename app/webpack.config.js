const path = require('path');
const fs = require('fs');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    hot: true,
    https: {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.crt')
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
