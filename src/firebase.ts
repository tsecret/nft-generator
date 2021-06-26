import firebase from 'firebase';
import config from './config';
import { nanoid } from 'nanoid'

if(firebase.apps.length ===0) firebase.initializeApp(config.FIREBASE_CONFIG);

const uploadImage = async (file: any) => {
    const ref: any = firebase.storage().ref().child(`images/${nanoid()}.png`);
    await ref.put(file);
    return await ref.getDownloadURL().then((downloadURL: string) => downloadURL);
}

export default {
    firebase,
    uploadImage,
}