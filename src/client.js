import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import getRoutes from './routes';

const component = (
  <Router children={getRoutes()} history={createBrowserHistory()}/>
);

ReactDOM.render(component, document.getElementById('content'));

window.React = React; // enable debugger
