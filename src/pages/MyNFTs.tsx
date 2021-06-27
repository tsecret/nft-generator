import React from 'react';
import { NFTData } from '../types';

import { Empty } from 'antd';
import firebase from '../firebase';
import utils from '../utils';
import { Header, NFTCard, LoadingModal } from '../components';

export const MyNFTs = () => {
    const [NFTs, setNFTs] = React.useState<NFTData[]>();

    const init = async () => {
        if(!localStorage.wallet) return;

        const NFTs: NFTData[]|void = await firebase.getMyNFTs(localStorage.wallet)
        .then((snapshot: any) => utils.getDocsFromSnapshot(snapshot))
        .catch((error: any) => { console.log(error) })

        if(!NFTs) return;
        setNFTs(NFTs);
    }

    const renderer = () => {
        if(NFTs && NFTs.length === 0) {
            return <Empty style={{ margin: 50 }} />
        } else if (NFTs){
            return <div className="nft-grid">
            {NFTs?.map((NFT: NFTData) => <NFTCard key={NFT.url} data={NFT} />)}
            </div>
        }
    }

    React.useEffect(() => {
        init()
    }, [])



    return (
        <div className="page">
            <Header />
            <span className="header">My NFTs</span>
            {renderer()}
        </div>
    )
}

export default MyNFTs