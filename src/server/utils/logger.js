import winston from 'winston';
import winstonConfig from 'winston/lib/winston/config';
import moment from 'moment';

winston.addColors({
  quiet: 'grey'
});

const consoleTimestamp = () =>
  moment().utcOffset(0).format('DD/MM/YYYY:HH:mm:ss ZZ');

const consoleFormatter = (options) => {
  const levelLabel = winston.config.colorize(options.level, options.level);
  const label = winston.config.colorize('quiet', options.label || '');
  const now = options.timestamp();
  const message = options.message;
  const meta = options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '';
  return `${levelLabel}: [${label}] [${now}] ${message} ${meta}`;
};

const defaultFormatter = (options) => {
  const levelLabel = winston.config.colorize(options.level, options.level);
  const label = winston.config.colorize('quiet', options.label || '');
  const message = options.message;
  const meta = options.meta && Object.keys(options.meta).length ? JSON.stringify(options.meta) : '';
  return `${levelLabel}: [${label}] ${message} ${meta}`;
};

const logger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      colorize: true,
    })
  ]
});

const fileErrorTransport = new (winston.transports.File)({
  level: 'error',
  name: 'errorFileTransport',
  filename: 'error.log',
});

winston.loggers.add('access', {
  console: {
    level: 'info',
    colorize: true,
    label: 'access',
    formatter: defaultFormatter
  },
  file: {
    filename: 'access.log'
  }
});

winston.loggers.add('error', {
  console: {
    level: 'error',
    colorize: true,
    label: 'error',
    formatter: defaultFormatter
  },
  transports: [
    fileErrorTransport
  ]
});

winston.loggers.add('remote', {
  console: {
    level: 'info',
    colorize: true,
    label: 'remote',
    timestamp: consoleTimestamp,
    formatter: consoleFormatter
  },
  file: {
    level: 'info',
    filename: 'api-remote.log'
  },
  transports: [
    fileErrorTransport
  ]
});

winston.loggers.add('react-ssr', {
  console: {
    level: 'info',
    colorize: true,
    label: 'react-ssr',
    timestamp: consoleTimestamp,
    formatter: consoleFormatter
  },
  file: {
    filename: 'react-ssr.log'
  },
  transports: [
    fileErrorTransport
  ]
});

winston.loggers.add('dev', {
  console: {
    level: 'silly',
    colorize: true,
    label: 'dev',
    timestamp: consoleTimestamp,
    formatter: consoleFormatter
  }
});

export default logger;
