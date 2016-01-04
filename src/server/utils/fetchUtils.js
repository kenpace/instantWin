import {loggers} from 'winston';
import moment from 'moment';

export async function handleResponse(originalUrl, res, cacheResponseFn) {
  log(res);

  if (res.status === 404) {
    let err = new errors.NotFoundError(res.statusText, res.url);
    throw err;
  }

  const json = await res.json();

  if (typeof cacheResponseFn === 'function') {
    cacheResponseFn(originalUrl, JSON.stringify(json));
  }

  return json;
}

function log(res) {
  const logger = loggers.get('remote');
  const level = res.status >= 500 ? 'error' :
                 res.status >= 400 ? 'warn' :
                 'info';

  logger.log(
    level,
    '-> %s %s %s',
    res.url,
    res.status,
    res.statusText
  );
}
