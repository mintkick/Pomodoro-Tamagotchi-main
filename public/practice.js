import { initializeApp} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
// import { getFirestore, collection, addDoc, getDocs, listCollections } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js%27';
import firebaseConfig from './config.js';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const db = getFirestore();

// const docRef = await addDoc(collection(db, 'tasks'), {
//   name: 'Los Angeles',
//   state: 'CA',
//   country: 'USA'
// });

const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Tasks"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };
  
  // fetchDocuments();


// getDocs()

// console.log('Document written with ID: ', docRef.id);