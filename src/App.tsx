import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";



import { GenerateNFT } from './pages'; 



const App = () => {
  

  return <Router>
        <Switch>
          <Redirect exact from="/" to="/generate" />
          <Route exact path="/generate" component={GenerateNFT} />
        </Switch>
  </Router>
}

export default App;
