import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";



import { GenerateNFT, Home, MarketPlace, MyNFTs } from './pages'; 



const App = () => {
  

  return <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/generate" component={GenerateNFT} />
          <Route exact path="/marketplace" component={MarketPlace} />
          <Route exact path="/mynfts" component={MyNFTs} />
        </Switch>
  </Router>
}

export default App;
