import React from 'react';

import { Button } from 'antd';

export const Header = () => {
    const [wallet, setWallet] = React.useState<string>();

    const currentWindow: any = window;

    const onConnectWallet = async () => {
        const accounts = await currentWindow.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
        localStorage.setItem('wallet', accounts[0]);
    }

    const checkAccounts = async () => {
        const accounts = await currentWindow.ethereum.request({ method: 'eth_accounts' });
        setWallet(accounts[0]);
        if(accounts[0]) localStorage.setItem('wallet', accounts[0]);
    }

    React.useEffect(() => {
        checkAccounts()
    }, [])

    return (
        <div className="row header-container">
            <span className="logo">NFT-GENERATOR</span>

            {wallet? 
            <span className="wallet-connected">Wallet connected ✅</span>
            :
            <Button className="" onClick={onConnectWallet}>Connect wallet</Button>
            }
        </div>
    )
}

export default Header;