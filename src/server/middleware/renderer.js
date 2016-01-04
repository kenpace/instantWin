import config from '../../../config';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Index from '../views/Index';

export default function(app) {
  return async (req, res, next) => {
    try {
      res.send(renderComponent(<div />));
    } catch (error) {
      next(error);
    }
  };
}

function renderComponent(component) {
  return `<!doctype html>
    ${renderToString(
      <Index
        server=''
        config={config}
        component={component}/>
    )}
  `;
}
