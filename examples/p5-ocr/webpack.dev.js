const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    static: './dist',
    host: '0.0.0.0',
    hot: true,
    server: 'https',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: []
};
