import 'isomorphic-fetch';
import Express from 'express';
import config from '../../config';
import handleErrors from './middleware/handleErrors';

const app = new Express();

// hot reloading config
if (__DEVELOPMENT__)
  require('./middleware/hotReload')(app);

// mount app at context path
app.use(config.appContext, (req, res, next) => {
  try {
    require('./middleware')(app)(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  require('./middleware/handleErrors')(app)(err, req, res, next);
});

app.listen(config.port || 3000, (err) => {
  if (err)
    console.error(err);
  else
    console.log('%s running on port %s', config.app.name, config.port || 3000);
});

export default app;
