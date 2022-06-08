import React from 'react';

import { Upload, Input, Button } from 'antd';
import firebase from '../firebase';
import { Header, LoadingModal, LoadingResult } from '../components';
import { nanoid } from 'nanoid'
import utils from '../utils';

import { contract } from '../contracts';

export const GenerateNFT = () => {

    const [error, setError] = React.useState<string>();

    const [generating, setGenerating] = React.useState<boolean>(false);
    const [generated, setGenerated] = React.useState<boolean>(false);

    const [info, setInfo] = React.useState<any>();
    const [file, setFile] = React.useState<any>();
    
    const [imageURL, setImageURL] = React.useState<string>();
    const [imageID, setImageID] = React.useState<string>();

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
        if(!file || !info || !localStorage.wallet || !imageURL) return setError("Error occured, please reload the page");

        setGenerating(true);

        const imageID: string = nanoid();
        
        const url: string|void = await firebase.uploadImage(file, imageID)
        .then((imageURL: string) => { setImageURL(imageURL); setImageID(imageID); return imageURL })
        .catch(async (error: any) => { setGenerating(false); setError("Error while uploading document"); console.error(error); await onFailure(imageID, null) })
        
        if(!url) return;

        const docID: string|void = await firebase.addDocument({ ...info, url: url, owner: localStorage.wallet, creator: localStorage.wallet })
        .then((doc: any) => { setInfo({ ...info, docID: doc.id }); return doc.id })
        .catch(async (error: any) => { setGenerating(false); setError("Error while working with database"); console.error(error); await onFailure(imageID, docID) })

        if (!docID) return;

        const JSONURL: string = `https://firestore.googleapis.com/v1/projects/nft-generator/databases/(default)/documents/NFTs/${docID}`;
            
        contract.mint(JSONURL, localStorage.wallet, info.price, async (err: any, txHash: string, NFTID: number) => {
            if(err) { setGenerating(false); setError("Error while minting"); console.error(error); await onFailure(imageID, docID) }

            setInfo({ ...info, id: NFTID });
            await firebase.updateDocument(docID, { txHash, id: NFTID, docID })
            .then(() => { setGenerating(false); setGenerated(true) })
            .catch(async (error: any) => { setGenerating(false); setError("Error while updating database"); console.error(error); await onFailure(imageID, docID) });
        })
       
    }

    const onFailure = async (imageID: string|null, docID: string|null|void) => {
        if (imageID) await firebase.removeImage(imageID);
        if (docID) await firebase.removeDocument(docID);
    }

    
    const renderer = () => {
        if(error){
            return <LoadingResult type="error" text={error} status="error" />
        } else if(generated){
            return <LoadingResult type="generation" text="Your NFT is ready!" status="success" url={imageURL} />
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