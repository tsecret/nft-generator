import firebase from 'firebase';
import config from './config';
import { NFTData } from './types';

if(firebase.apps.length ===0) firebase.initializeApp(config.FIREBASE_CONFIG);

const db: any = firebase.firestore().collection(config.COLLECTION_NAME);

const uploadImage = async (file: any, imageID: string) => {
    const ref: any = firebase.storage().ref().child(`${config.COLLECTION_NAME}/${imageID}.${config.IMAGE_EXTENTION}`);
    await ref.put(file);
    return await ref.getDownloadURL().then((downloadURL: string) => downloadURL);
}

const removeImage = async (imageID: string) => {
    return await firebase.storage().ref().child(`${config.COLLECTION_NAME}/${imageID}.${config.IMAGE_EXTENTION}`).delete()
}

const addDocument = async (data: NFTData) => {
    return await db.add(data);
}

const removeDocument = async (docID: string) => {
    return await db.doc(docID).delete();
}

const updateDocument = async (docID: string, data: object) => {
    return await db.doc(docID).update(data);
}

const getDocument = async(docID: string) => {
    return await db.doc(docID).get();
}

const getMyNFTs = async (address: string) => {
    return await db.where("owner", "==", address).get()
}

const getAllNFT = async () => {
    return await db.get()
}

export default {
    firebase,
    uploadImage,
    removeImage,
    addDocument,
    removeDocument,
    updateDocument,
    getDocument,
    getMyNFTs,
    getAllNFT
}