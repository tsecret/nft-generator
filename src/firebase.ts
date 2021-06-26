import firebase from 'firebase';
import config from './config';
import { NFTData } from './types';

if(firebase.apps.length ===0) firebase.initializeApp(config.FIREBASE_CONFIG);

const uploadImage = async (file: any, imageID: string) => {
    const ref: any = firebase.storage().ref().child(`NFTs/${imageID}.png`);
    await ref.put(file);
    return await ref.getDownloadURL().then((downloadURL: string) => downloadURL);
}

const removeImage = async (imageID: string) => {
    return await firebase.storage().ref().child(`NFTs/${imageID}.png`).delete()
}

const addDocument = async (collectionName: string, data: NFTData) => {
    return await firebase.firestore().collection(collectionName).doc(data.id).set(data)
}


const getMyNFTs = async (address: string) => {
    return await firebase.firestore().collection("NFTs").where("owner", "==", address).get()
}

export default {
    firebase,
    uploadImage,
    removeImage,
    addDocument,
    getMyNFTs
}