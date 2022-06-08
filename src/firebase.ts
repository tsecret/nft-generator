import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, updateDoc, getDoc, query, where, getDocs, QuerySnapshot, DocumentData, limit } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import config from './config';
import { NFTData } from './types';


const app = initializeApp(config.FIREBASE_CONFIG)
const firestore = getFirestore(app)
const storage = getStorage(app);
const auth = getAuth(app)
const nftsRef = collection(firestore, "NFTs");
const provider = new GoogleAuthProvider()

const uploadImage = async (file: any, imageID: string) => {
    const storageRef = ref(storage, `NFTs/${imageID}.png`)
    return await uploadBytes(storageRef, file)
    .then(val => getDownloadURL(val.ref))
}

const removeImage = async (imageID: string) => {
    const storageRef = ref(storage, `NFTs/${imageID}.png`)
    return await deleteObject(storageRef)
    .then(() => true)
    .catch((error) => { console.error(error) });
}

const addDocument = async (data: NFTData) => {
    return await setDoc(doc(nftsRef, "NFTs"), data)
}

const removeDocument = async (docID: string) => {
    return await deleteDoc(doc(nftsRef, "NFTs", docID));
}

const updateDocument = async (docID: string, data: object) => {
    return await updateDoc(doc(nftsRef, "NFTs", docID), data);
}

const getDocument = async (docID: string) => {
    return await getDoc(doc(nftsRef, "NFTs", docID));
}

const getListFromSnapshot = (snap: QuerySnapshot<DocumentData>): Document[] => {
    let documents: any[] = []
    snap.forEach(doc => { documents.push(doc.data()) })
    return documents;
}

const getMyNFTs = async (address: string) => {
    return getListFromSnapshot(await getDocs(query(nftsRef, where('owner', '==', address))))
}

const getAllNFT = async () => {
    return getListFromSnapshot(await getDocs(query(nftsRef, limit(25))))
}

export const onGoogleLogin = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error("Error during authorization")
        const token = credential.accessToken;
        const user = result.user;
        console.log(user)
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

export default {
    uploadImage,
    removeImage,
    addDocument,
    removeDocument,
    updateDocument,
    getDocument,
    getMyNFTs,
    getAllNFT
}