// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";

//Install firebase module , 'npm i firebase'.
//Integrating firebase in our project
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore' // firestore is a database where we store values in key-value pair

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfYC_b-X2IsIGom-tPbR384n04n-TKE5A",
    authDomain: "reels-d35b8.firebaseapp.com",
    projectId: "reels-d35b8",
    storageBucket: "reels-d35b8.appspot.com",
    messagingSenderId: "353151802161",
    appId: "1:353151802161:web:98e243d12b23e2d9676e10"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// const app = initializeApp(firebaseConfig);

//exporting auth functions of Firebase for performing authorization
export const auth = firebase.auth()

//exporting the users, posts & comments collection 
const firestore = firebase.firestore();
export const database = {
    users: firestore.collection('users'),
    posts: firestore.collection('posts'),
    comments: firestore.collection('comments'),
    getTimeStamp: firebase.firestore.FieldValue.serverTimestamp,//for sorting the posts on the basis of time stamp
}

//exporting the firebase storage to store the image,videos
export const storage = firebase.storage()