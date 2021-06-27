import React from 'react';

import { Upload, Input, Button } from 'antd';
import firebase from '../firebase';
import { Header, LoadingModal, NFTGenerationResult } from '../components';
import { nanoid } from 'nanoid'
import utils from '../utils';
import config from '../config';

import { Lemon, LemonToken, isApproved } from '../contracts';

export const GenerateNFT = () => {

    const [generating, setGenerating] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>();
    const [imageURL, setImageURL] = React.useState<string>();
    const [info, setInfo] = React.useState<any>();
    const [generated, setGenerated] = React.useState<boolean>(false);
    const [file, setFile] = React.useState<any>();
    
    const [contract] = React.useState(new Lemon(config.CONTRACT_ADDRESS));
    const [token] = React.useState(new LemonToken(config.TOKEN_CONTRACT));

    const beforeUpload = (file:any) => {
        setFile(file);
        utils.getBase64(file, (imageURL: any) => {
            setImageURL(imageURL)
        })
        return false
    }

    const onTextChange = (event: any) => {
        let {name, value} = event.target;
        if (['price', 'amount'].includes(name)) value = parseFloat(value);
        setInfo({ ...info, [name]: value || null })
    }

    const onGenerate = async () => {

        // ! Add onFailure

        if(!file || !info || !localStorage.wallet || !imageURL) return setError("Error occured, please reload the page");

        setGenerating(true);

        const imageID: string = nanoid();
        const url: string = await firebase.uploadImage(file, imageID)
        .then((imageURL: string) => { setImageURL(imageURL); return imageURL });
        

        const docID: string|void = await firebase.addDocument({ ...info, url: url, owner: localStorage.wallet, creator: localStorage.wallet })
        .then((doc: any) => doc.id)
        .catch((error: any) => { console.log(error); setGenerating(false) })

        if (!docID) return;

        const JSONURL: string = `https://firestore.googleapis.com/v1/projects/nft-generator/databases/(default)/documents/NFTs/${docID}`;

        const { txHash, NFTID }: any = await new Promise((resolve, reject) => {
            contract.mint(JSONURL, localStorage.wallet, info.price, function(err: any, txHash: string, NFTID: number) {
                if(err) { onFailure(); setError("Error while minting"); reject() }
                setInfo({ ...info, id: NFTID })
                resolve({txHash, NFTID});
            })
        })

        await firebase.updateDocument(docID, { txHash, id: NFTID, docID })
        .then(() => { setGenerating(false); setGenerated(true) })
        .catch((error: any) => { console.log(error); setGenerating(false) })
    }

    const onFailure = async () => {
        if (imageURL) await firebase.removeImage(imageURL);
        if (info && info.id) await firebase.removeDocument(info.id);
    }

    const onApprove = async () => {
        console.log(await isApproved(localStorage.wallet))
    }

    const onBalance = async () => {
        const balance: any = await contract.balanceOf(localStorage.wallet);
        console.log(balance);
    }
    
    const renderer = () => {
        if(generated){
            return <NFTGenerationResult status="success" url={imageURL} />
        } else if(generating){
            return <LoadingModal text="Generating NFT..." />
        } else {
            return <>
                <span className="header">Create your own NFT</span>
                {error && <span className="error">{error}</span>}

                <div className="container">
                    <Upload
                        className="upload"
                        disabled={generating}
                        listType="picture-card"
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                    >
                        {imageURL? <img src={imageURL} alt="nft" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <span>Upload NFT</span> }
                    </Upload>


                    <Input name="name" onChange={onTextChange} placeholder="NFT name" className="input" />
                    <Input.TextArea name="description" onChange={onTextChange} placeholder="Description" className="input" />

                    <Input name="price" onChange={onTextChange} placeholder="Price" className="input" />  

                    <Button onClick={onGenerate} disabled={!(info && info.name && info.description && info.price)} className="button gradient">Generate</Button>
                    <Button onClick={onBalance} className="button gradient">Balance</Button>
                    <Button onClick={onApprove} className="button gradient">Approve</Button>
                </div>
            </>
        }
    }

    return (
        <div className="page">
            <Header />
            {renderer()}
        </div>
    )
}

export default GenerateNFT;