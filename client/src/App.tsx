import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { HomePage, ProductionPage } from './pages';
import { DBService } from './services';

import './App.css';

export const DBServiceContext = React.createContext(new DBService());

export const App = () => {
  return (
    <React.Fragment>
    	<Router>
	        <Route exact path="/" component={HomePage} />
          <DBServiceContext.Provider value={new DBService()}>
	          <Route path="/production/:product" component={ProductionPage} />
          </DBServiceContext.Provider>
          {/*<Route path="*" component={HomePage} />*/}
    	</Router>
    </React.Fragment>
  );
}

