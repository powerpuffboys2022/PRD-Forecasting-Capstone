import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey : process.env.firebaseConfig_apiKey,
    authDomain : process.env.firebaseConfig_authDomain,
    projectId : process.env.firebaseConfig_projectId,
    storageBucket : process.env.firebaseConfig_storageBucket,
    messagingSenderId : process.env.firebaseConfig_messagingSenderId,
    appId : process.env.firebaseConfig_appId,
    measurementId : process.env.firebaseConfig_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app);

export {storage}