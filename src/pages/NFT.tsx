import React from 'react';

import { Header } from '../components';
import firebase from '../firebase';
import utils from '../utils'

import { NFTData } from '../types';

export const NFT = () => {

    const [NFT, setNFT] = React.useState<NFTData>();

    const init = async () => {
        
    }

    return (
        <div className="page">
            <Header />

            <div className="container">
                <img />
            </div>

        </div>
    )
}

export default NFT;