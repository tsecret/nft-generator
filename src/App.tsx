import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';

import { GenerateNFT } from './pages'; 

const App = () => {
  return <Router>
        <Switch>
          <Route exact path="/generate" component={GenerateNFT} >
          </Route>
        </Switch>
  </Router>
}

export default App;
