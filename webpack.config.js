const path = require('path');

const defaults = {
  mode: 'development',
  entry: {
    'p-code': './lib/index.js'
  },
  output: {
		filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'p-code',
		libraryTarget: "umd",
		globalObject: "typeof self !== 'undefined' ? self : this"
  },
  plugins: []
};

const production = Object.assign({}, defaults, {
  mode: 'production',
  devtool: 'source-map'
});

module.exports = (env) => {
  return env.production ? production : defaults;
};
