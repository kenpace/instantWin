// jscs:disable

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');
var appConfig = require('./config');

var relativeAssetsPath = 'static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);

var config = {
  devtool: 'source-map',
  context: path.resolve(__dirname),

  entry: [
    './src/client.js',
  ],

  progress: true,

  output: {
    path: assetsPath,
    filename: 'bundle.js',
    publicPath: appConfig.appContext + '/dist/',
  },

  module: {
    loaders: [
      {test: /\.svg$/, loader: 'raw'},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true')},
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel',
        "query": {
          "stage": 0,
          "optional": ["es7.asyncFunctions", "runtime"]
        }
      },
      {test: /\.json$/, loader: 'json-loader' },
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    new ExtractTextPlugin('app.css', {
        allChunks: true
    }),

    // optimizations
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //       warnings: false
    //     }
    // }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
  ]

}

module.exports = config;
