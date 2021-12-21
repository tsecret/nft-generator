import React from 'react';

import { Button } from 'antd';
import utils from '../utils';
import { connectWallet, checkWalletAccounts } from '../contracts';

export const Header = () => {
    const [wallet, setWallet] = React.useState<string>();

    const init = async () => {
        setWallet(await checkWalletAccounts())
    }

    React.useEffect(() => {
        init()
    }, [])

    return (
        <div className="row header-container">
            <a className="link logo" href="/">🍋 <strong>NFT</strong></a>

            <a className="link" href="/marketplace">Market Place</a>
            <a className="link" href="/mynfts">My Items</a>
            <a className="link" href="/generate">Generate NFT</a>

            {wallet? 
            <span className="wallet-connected gradient">{utils.stripAddress(wallet)}</span>
            :
            <Button className="" onClick={async () => { setWallet(await connectWallet()) }}>Connect wallet</Button>
            }
        </div>
    )
}

export default Header;