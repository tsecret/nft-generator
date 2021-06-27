import React from 'react';

import { Button } from 'antd';
import { connectWallet, checkWalletAccounts, approve } from '../contracts';
import utils from '../utils';

export const Home = () => {
    const [wallet, setWallet] = React.useState<string>();
    const [approved, setApproved] = React.useState<boolean>(false);

    const init = async () => {
        setWallet(await checkWalletAccounts())
    }

    const onApprove = async () => {
        const txHash: string|void|unknown = await approve();
        if(txHash) setApproved(true);
    }

    const renderButtons = () => {
        if(wallet){
            return <>
            <span style={{ width: "100%" }} className="wallet-connected gradient-border">{utils.stripAddress(wallet)}</span>
            <Button className="button gradient" onClick={onApprove}>{approved? "Approved" : "Approve"}</Button>
            <Button className="button gradient" href="/marketplace">View Market Place</Button>
            </>
        } else {
            return <Button className="button gradient" onClick={async () => { setWallet(await connectWallet()) }}>Connect wallet</Button>
        }
    }

    React.useEffect(() => {
        init()
    }, [])

    return (
        <div className="page">
            <span className="brand">Welcome to Lemon🍋 NFT</span>

            <div className="container">
                <span className="text" style={{ marginBottom: 20 }}>Before proceeding, make sure to connect your wallet, then approve it</span>
                {renderButtons()}
            </div>

        </div>
    )
}

export default Home;