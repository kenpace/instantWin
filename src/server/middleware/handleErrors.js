import {AppError} from '../utils/errors';
import winston from 'winston';

export default function(app) {
  const logger = app.locals.logger;
  const errorLog = winston.loggers.get('error');

  return function(err, req, res, next) {

    switch (err.name) {
      case 'RequestError':
        res.status(err.status || 400).json(err);
        break;
      case 'AuthorizationError':
        res.status(err.status || 401).json(err);
        break;
      case 'UnauthorizedError':
        res.status(err.status || 401).json(err);
        break;
      case 'AuthenticationError':
        res.status(err.status || 403).json(err);
        break;
      case 'NotFoundError':
        res.status(err.status || 404).json(err);
        break;
      case 'BadGateway':
        res.status(err.status || 502).json(err);
        break;
      case 'AppError':
        errorLog.error(err.stack);
        res.status(err.status || 500).json(err);
        break;
      default:
        errorLog.error(err.stack);
        const error = new AppError(
          __DEVELOPMENT__ ? err.stack : 'Something is broken!'
        );
        res.status(err.status || 500).json(error);
    }
  };
}
