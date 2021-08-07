import React from 'react';
import { useParams } from 'react-router-dom';

import { Button, Divider } from 'antd';
import { Header, LoadingResult, LoadingModal } from '../components';
import firebase from '../firebase';
import utils from '../utils'

import { contract } from '../contracts';

import { NFTData } from '../types';

export const NFT = () => {
    const [buying, setBuying] = React.useState<boolean>(false);
    const [complete, setComplete] = React.useState<boolean>(false);
    
    const [error, setError] = React.useState<string>();
    const [NFT, setNFT] = React.useState<NFTData>();

    const { id }: any = useParams();

    const init = async () => {
        const NFT: NFTData|undefined = await firebase.getDocument(id)
        .then((doc: any) => doc.data())
        .catch((error: any) => { setError("Error while loading NFT data"); console.error(error) });

        if(!NFT) return;
        setNFT(NFT);
    }

    // ! Error handling
    const onBuy = async () => {
        if(!localStorage.wallet || !NFT) return;
        
        setBuying(true);
        contract.buy(NFT.id, localStorage.wallet, async (err: any, txHash: string) => {
            if(err) { console.log(err); setBuying(false); return }

            await firebase.updateDocument(id, { owner: localStorage.wallet })
            .then(() => { setComplete(true) })
            .catch((error: any) => { setBuying(false); console.error(error); setError("Database error") })
        })
        setBuying(false);
    }




    const renderer = () => {
        if(error){
            <LoadingResult type="error" text={error} status="error"/>;
        } else if(complete){
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
                <span className="nft-card-price nft-card-price-big">Price: <strong>{NFT.price} 🍋</strong></span>
                
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