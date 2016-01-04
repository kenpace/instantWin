const path = require('path');
const chokidar = require('chokidar');
const webpack = require('webpack');
const winston = require('winston');
const webpackConfig = require('../../../webpack.dev');

const compiler = webpack(webpackConfig);
const watcher = chokidar.watch('./');
const logger = winston.loggers.get('dev');

watcher.on('ready', function() {
  watcher.on('all', function(...args) {
    logger.info('clearing /server/ module cache from server');
    Object.keys(require.cache).forEach(function(id) {
      if (/\/src\/server\//.test(id)) {
        delete require.cache[id];
      }
    });
  });
});

compiler.plugin('done', function() {
  logger.info('Clearing /src/ module cache from server');
  const srcPath = path.resolve(__dirname, '../../');
  const regex = new RegExp(srcPath.replace(/\//g, '\\/'));
  Object.keys(require.cache).forEach(function(id) {
    if (regex.test(id)) {
      delete require.cache[id];
    }
  });
});

export default function(app) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}
