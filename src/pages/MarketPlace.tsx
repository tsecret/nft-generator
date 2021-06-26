import React from 'react';

import { Header, NFTCard, LoadingModal } from '../components';
import { NFTData } from '../types';
import firebase from '../firebase';
import utils from '../utils';

export const MarketPlace = () => {

    const [NFTs, setNFTs] = React.useState<NFTData[]>();

    const init = async () => {

        const NFTs: NFTData[]|void = await firebase.getAllNFT()
        .then((snapshot: any) => utils.getDocsFromSnapshot(snapshot))
        .catch((error: any) => { console.log(error) })

        if(!NFTs) return;
        setNFTs(NFTs);
    }

    React.useEffect(() => {
        init();
    } ,[])

    return (
        <div className="page">
            <Header />

            <div className="nft-grid">
            {NFTs?.map((NFT: NFTData) => <NFTCard key={NFT.url} data={NFT} />)}
            </div>
            
        </div>
    )
}

export default MarketPlace;
