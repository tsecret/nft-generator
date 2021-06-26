import React from 'react';
import { useParams } from 'react-router-dom';

import { Button } from 'antd';
import { Header, NFTGenerationResult, LoadingModal } from '../components';
import firebase from '../firebase';
import utils from '../utils'
import config from '../config';

import Lemon from '../contracts/lemon';

import { NFTData } from '../types';

export const NFT = () => {
    const [NFT, setNFT] = React.useState<NFTData>();
    const [contract] = React.useState(new Lemon(config.CONTRACT_ADDRESS));
    const [buying, setBuying] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    

    const { id }: any = useParams();

    // ! Error handling
    const init = async () => {
        const NFT: NFTData|undefined = await firebase.getDocument(id)
        .then((doc: any) => doc.data())
        .catch((error: any) => { console.log(error) });

        if(!NFT) return;
        setNFT(NFT);
    }

    // ! Error handling
    const onBuy = async () => {
        if(!localStorage.wallet || !NFT) return;
        
        setBuying(true);
        const txHash: any = await new Promise((resolve, reject) => {
            contract.buy(NFT.id, localStorage.wallet, (err: any, txHash: string) => {
                if(err) { setBuying(false); return reject() };
                resolve(txHash);
            })
        })

        if(!txHash) return; 

        await firebase.updateDocument(id, { owner: localStorage.wallet })
        .then(() => { setComplete(true) })
        .catch((error: any) => { console.log(error); })

        setBuying(false);
    }

    const renderer = () => {
        if(complete){
            return <NFTGenerationResult status="success"/>;
        } else if(buying) {
            return <LoadingModal text="Transaction pending..." /> 
        } else if (NFT) {
            return <div className="container">
                <img src={NFT.url} alt="nft" />
                <span>{NFT.name}</span>
                <span>{NFT.description}</span>
                <span>{NFT.price}</span>
                <Button onClick={onBuy} className="button">Buy</Button>
            </div>
        } else {
            return <span>Loading</span>;
        }
    }

    React.useEffect(() => {
        init();
    }, [])



    return (
        <div className="page">
            <Header />
            {renderer()}
        </div>
    )
}

export default NFT;