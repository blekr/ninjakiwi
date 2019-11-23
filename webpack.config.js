const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  watchOptions: {
    ignored: /node_modules/
  },
  entry: {
    background: ['babel-polyfill', './src/bg/background.js'],
    content: ['babel-polyfill', './src/inject/inject.js'],
    dialog: ['./src/dialog/dialog.js'],
    open: ['./src/inject/open.js'],
    hotReload: './src/bg/hotReload.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      { from: 'manifest.json', to: '.' },
      { from: 'src/options/index.html', to: './options.html' },
      { from: 'assets', to: './assets' },
      { from: 'src/dialog/dialog.html', to: './dialog.html' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  }
};
