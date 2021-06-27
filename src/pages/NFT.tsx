import React from 'react';
import { useParams } from 'react-router-dom';

import { Button, Divider } from 'antd';
import { Header, LoadingResult, LoadingModal } from '../components';
import firebase from '../firebase';
import utils from '../utils'
import config from '../config';

// import Lemon from '../contracts/lemon';
import Lemon from '../contracts/nft_w_lemon';

import { NFTData } from '../types';

export const NFT = () => {
    const [NFT, setNFT] = React.useState<NFTData>();
    const [contract] = React.useState(new Lemon(config.CONTRACT_ADDRESS_w_l));
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

    console.log(contract.price(2));
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
            return <LoadingResult type="buying" text="Transaction complete!" status="success"/>;
        } else if(buying) {
            return <LoadingModal text="Transaction pending..." /> 
        } else if (NFT) {
            return <div className="container nft-card nft-card-big">
                <img src={NFT.url} className="nft-card-image nft-card-image-big" alt="nft" />
                <span className="nft-card-name nft-card-name-big">{NFT.name}</span>
                <span className="nft-card-description">{NFT.description? NFT.description : "No description"}</span>
                <Divider />
                <span className="nft-card-price nft-card-price-big">NFT ID: <strong>{NFT.id}</strong></span>
                <span className="nft-card-price nft-card-price-big">Creator: <strong>{utils.stripAddress(NFT.creator)}{NFT.creator === localStorage.wallet && " (You)"}</strong></span>
                <span className="nft-card-price nft-card-price-big">Owner: <strong>{utils.stripAddress(NFT.owner)}{NFT.owner === localStorage.wallet && " (You)"}</strong></span>
                <span className="nft-card-price nft-card-price-big">Price: <strong>{NFT.price} BNB</strong></span>
                
                {NFT.owner !== localStorage.wallet && <Divider /> && <Button onClick={onBuy} className="button gradient">Buy</Button>}
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