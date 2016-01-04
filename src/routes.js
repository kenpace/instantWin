import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';

function getRoutes() {
  return (
    <Route component={App} path='/'>

    </Route>
  );
}

export default getRoutes;
