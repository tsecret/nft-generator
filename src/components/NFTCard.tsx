import React from 'react';

import { NFTData } from '../types';

export const NFTCard = ({ data }: any) => {
    return (
        <div className="container nft-card">
            <img src={data.url} alt="nft" className="nft-card-image" />
            <span className="nft-card-name">{data.name}</span>
            <span className="nft-card-price">{data.price}</span>
        </div>
    )
}

export default NFTCard
