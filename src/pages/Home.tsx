import React from 'react';

import { Button } from 'antd';
import { connectWallet, checkWalletAccounts, approve } from '../contracts';
import utils from '../utils';
import { onGoogleLogin } from '../firebase';

export const Home = () => {
    const [wallet, setWallet] = React.useState<string>();
    const [authed, setAuthed] = React.useState<boolean>(false);
    const [approved, setApproved] = React.useState<boolean>(false);
    
    const init = async () => {
        setWallet(await checkWalletAccounts());
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


            <aside className="p-12 bg-gray-100 sm:p-16 lg:p-24">
                <div className="max-w-xl mx-auto text-center">
                    <p className="text-sm font-medium text-gray-500">
                    Welcome to
                    </p>

                    <p className="mt-2 text-3xl font-bold sm:text-5xl">
                    Lemon🍋 NFT Marketplace
                    </p>

                    <div className="mt-8 sm:items-center sm:justify-center sm:flex">
                    <a href="" className="block px-5 py-3 font-medium text-white bg-blue-500 rounded-lg shadow-xl hover:bg-blue-600">
                        {authed && approved ? 
                            <p className="btn">Create NFT</p>
                            :<p className="btn">Create NFT</p>
                        }
                    </a>

                    <a
                        href=""
                        className="block px-5 py-3 mt-4 font-medium text-blue-500 rounded-lg hover:text-blue-600 sm:mt-0"
                    >
                        View marketplace
                    </a>
                    </div>
                </div>
            </aside>

            <span className="brand">Welcome to Lemon🍋 NFT</span>

            <div className="container">
                <span className="text" style={{ marginBottom: 20 }}>Before proceeding, make sure to connect your wallet, then approve it</span>
                {renderButtons()}
            </div>

            <ul className="steps steps-vertical">
                <li className="step step-primary">Sign in with Google</li>
                <li className="step step-primary">Connect Metamask</li>
                <li className="step">Approve wallet</li>
            </ul>

            <button className="btn-success" onClick={onGoogleLogin}>Google</button>

        </div>
    )
}

export default Home;