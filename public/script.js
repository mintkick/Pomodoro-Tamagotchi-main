
// import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import firebaseConfig from 'config.js'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import firebase from 'firebase/app';
document.addEventListener('DOMContentLoaded', function() {
const loadEl = document.querySelector('#load');
console.log('The js is connected')
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!

// firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => { });
firebase.database().ref('/path/to/ref').on('value', snapshot => { });
firebase.firestore().doc('/foo/bar').get().then(() => { });
firebase.functions().httpsCallable('yourFunction')().then(() => { });
firebase.messaging().requestPermission().then(() => { });
firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
firebase.analytics(); // call to activate
firebase.analytics().logEvent('tutorial_completed');
firebase.performance(); // call to activate

// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

try {
    let app = firebase.app();
    let features = [
    'auth', 
    'database', 
    'firestore',
    'functions',
    'messaging', 
    'storage', 
    'analytics', 
    'remoteConfig',
    'performance',
    ].filter(feature => typeof app[feature] === 'function');
    loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
} catch (e) {
    console.error(e);
    loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
}
});

async function getCollections() {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const collections = collectionGroup(db, "");
    console.log(collections)

    const querySnapshot = await getDocs(collections);

    const collectionIds = querySnapshot.docs.map((doc) => doc.ref.parent.id);


    return collectionIds;


    
}


// console.log("I made it")
// getCollections()
// .then((collectionIds) => {
//     console.log("This function has been entered")
//     console.log("Collections: ", collectionIds);
// })
// .catch((error) => {
//     console.error("Error getting collections: ", error);
// })






