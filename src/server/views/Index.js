import React, {Component, PropTypes} from 'react';
import {renderToString} from 'react-dom/server';

export default class Index extends Component {
  render() {
    const {config, server, component} = this.props;
    return (
      <html lang='en-us'>
        <head>
          <meta charSet='utf-8'/>
          <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1'/>
          <title>{config.app.name}</title>
          <meta name='description' content=''/>
          <base href={`${config.appContext}/`} />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
          <link rel="stylesheet" src="/css/react-bootstrap-table.min.css" />
          <link href='//fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'/>
          <link rel='shortcut icon' href={`${config.appContext}/favicon.png`} />
          {config.isProduction && <link rel='stylesheet' href={`${config.appContext}/dist/app.css`} />}
        </head>
        <body>
                    
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h2>Instant Win</h2>
                <p><strong>NOTE:</strong>  Jobs listed below do not have On-Pak distribution and are not past the On-Pak LOF deadline.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">            
                <div id='content' dangerouslySetInnerHTML={{__html: renderToString(component)}}/>
              </div>
            </div>            
            <div className="clearfix"><p>&nbsp;</p></div>                        
          </div>
          <script src={`${config.appContext}/dist/bundle.js`}/>
          
          
        </body>
      </html>
    );
  }
}
