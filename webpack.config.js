const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  watchOptions: {
    ignored: /node_modules/
  },
  entry: {
    background: './src/bg/background.js',
    hotReload: './src/bg/hotReload.js',
    content: './src/inject/inject.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      { from: 'manifest.json', to: '.' },
      { from: 'src/options/index.html', to: './options.html'},
      { from: 'assets', to: './assets'}
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  }
};
