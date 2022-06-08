import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import { GenerateNFT, MarketPlace, MyNFTs, NFT, Home } from './pages'; 



const App = () => {
  

  return <Router>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/generate" element={ <GenerateNFT /> } />
          <Route path="/marketplace" element={ <MarketPlace /> } />
          <Route path="/mynfts" element={ <MyNFTs /> } />
          <Route path="/nft/:id" element={ <NFT /> } />
        </Routes>
  </Router>
}

export default App;
