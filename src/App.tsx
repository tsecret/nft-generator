import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";



import { GenerateNFT, MarketPlace, MyNFTs, NFT } from './pages'; 



const App = () => {
  

  return <Router>
        <Switch>
          <Redirect exact from="/" to="/marketplace" />
          <Route exact path="/generate" component={GenerateNFT} />
          <Route exact path="/marketplace" component={MarketPlace} />
          <Route exact path="/mynfts" component={MyNFTs} />
          <Route exact path="/nft/:id" component={NFT} />
        </Switch>
  </Router>
}

export default App;
