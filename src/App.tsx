import { BrowserRouter as Router, Switch, Route } from "react-router-dom";



import { GenerateNFT, MarketPlace, MyNFTs, NFT, Home } from './pages'; 



const App = () => {
  

  return <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/generate" component={GenerateNFT} />
          <Route exact path="/marketplace" component={MarketPlace} />
          <Route exact path="/mynfts" component={MyNFTs} />
          <Route exact path="/nft/:id" component={NFT} />
        </Switch>
  </Router>
}

export default App;
