import React from 'react';

import { Upload, Input, Button } from 'antd';
import firebase from '../firebase';
import { Header, LoadingModal, NFTGenerationResult } from '../components';
import { nanoid } from 'nanoid'

export const GenerateNFT = () => {

    const [uploading, setUploading] = React.useState<boolean>(false);
    const [generating, setGenerating] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [imageURL, setImageURL] = React.useState<string>();
    const [imageID, setImageID] = React.useState<string>();
    const [info, setInfo] = React.useState<any>();
    const [generated, setGenerated] = React.useState<boolean>(false);

    const onUpload = async (options: any) => {
        setUploading(true);
        const { onSuccess, onError, file } = options;
        try {
            const imageID: string = nanoid();
            await firebase.uploadImage(file, imageID)
            .then((imageURL: string) => { setImageURL(imageURL); setImageID(imageID) })
            
            onSuccess(file);
        } catch (err) {
            onError(err)
        }
        setUploading(false);
    };

    const onTextChange = (event: any) => {
        let {name, value} = event.target;
        if (['price', 'amount'].includes(name)) value = parseInt(value);
        setInfo({ ...info, [name]: value || null })
    }

    const onGenerate = async () => {
        if(!localStorage.wallet || !imageURL) return setError("Error occured, please reload the page");

        setGenerating(true);
        await firebase.addDocument("NFTs", { ...info, url: imageURL, owner: localStorage.wallet })
        .then((res: any) => { setGenerating(false); setGenerated(true) })
        .catch((error: any) => { console.log(error); setGenerating(false) })
    }

    const onFailure = async () => {
        if(!imageID || !info || !generated) return;
        await firebase.removeImage(imageID)
        .then((res: any) => { console.log("ok") })
        .catch((error: any) => { console.error(error) })
    }

    const renderer = () => {
        if(generated){
            return <NFTGenerationResult status="success" url={imageURL} />
        } else if(generating){
            return <LoadingModal />
        } else {
            return <>
                <span className="header">Create your own NFT</span>
                {error && <span className="error">{error}</span>}

                <div className="container">
                    <Upload
                        className="upload"
                        disabled={uploading}
                        listType="picture-card"
                        customRequest={onUpload}
                        showUploadList={false}
                        onChange={(filelist: any) => { console.log(filelist) }}
                    >
                        {imageURL? <img src={imageURL} alt="nft" style={{ width: '100%' }} /> : <span>Upload NFT</span> }
                    </Upload>


                    <Input name="name" onChange={onTextChange} placeholder="NFT name" className="input" />
                    <Input.TextArea name="description" onChange={onTextChange} placeholder="Description" className="input" />

                    <div className="row inputs">
                        <Input name="amount" onChange={onTextChange} placeholder="Amount" className="input input-short" />
                        <Input name="price" onChange={onTextChange} placeholder="Price" className="input input-short" />  
                    </div>

                    <Button onClick={onGenerate} disabled={!(info && info.name && info.description && info.amount && info.price)} className="button button-generate">Generate</Button>
                </div>
            </>
        }
    }

    React.useEffect(() => {


        return () => {
            onFailure()
        }
    }, [])


    return (
        <div className="page">
            <Header />
            {renderer()}
        </div>
    )
}

export default GenerateNFT;