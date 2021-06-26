import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";



import { GenerateNFT, MarketPlace, MyNFTs } from './pages'; 



const App = () => {
  

  return <Router>
        <Switch>
          <Redirect exact from="/" to="/marketplace" />
          <Route exact path="/generate" component={GenerateNFT} />
          <Route exact path="/marketplace" component={MarketPlace} />
          <Route exact path="/mynfts" component={MyNFTs} />
        </Switch>
  </Router>
}

export default App;
