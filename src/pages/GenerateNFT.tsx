import React from 'react';

import { Upload, Input, Button, Space } from 'antd';
import firebase from '../firebase';
import { Header } from '../components';

interface NFTData {
    name: string,
    description: string,
    amount: number,
    price: number,
    url?: string
}

export const GenerateNFT = () => {

    const [uploading, setUploading] = React.useState<boolean>(false);
    const [imageURL, setImageURL] = React.useState<string>("");
    const [info, setInfo] = React.useState<any>();

    

    const onUpload = async (options: any) => {
        setUploading(true);
        const { onSuccess, onError, file } = options;
        try {
            await firebase.uploadImage(file)
            .then((imageURL: string) => { setImageURL(imageURL) })
            onSuccess(file);
        } catch (err) {
            onError(err)
        }
        setUploading(false);
    };

    const onTextChange = (event: any) => {
        const {name, value} = event.target;
        setInfo({ ...info, [name]: value || null })
        console.log(info);
    }

    React.useEffect(() => {
    }, [])

    return (
        <div className="page">
            <Header />
            <span className="header">Create your own NFT</span>

            <div className="container">
                <Upload
                    className="upload"
                    disabled={uploading}
                    listType="picture-card"
                    customRequest={onUpload}
                    showUploadList={false}
                >
                    {imageURL? <img src={imageURL} alt="nft" style={{ width: '100%' }} /> : <span>Upload NFT</span> }
                </Upload>


                <Input name="name" onChange={onTextChange} placeholder="NFT name" className="input" />
                <Input.TextArea name="description" onChange={onTextChange} placeholder="Description" className="input" />

                <div className="row inputs">
                    <Input name="amount" onChange={onTextChange} placeholder="Amount" className="input input-short" />
                    <Input name="price" onChange={onTextChange} placeholder="Price" className="input input-short" />  
                </div>



                <Button disabled={!(info && info.name && info.description && info.amount && info.price)} className="button button-generate">Generate</Button>
            </div>
        </div>
    )
}

export default GenerateNFT;