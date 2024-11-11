import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore();

const docRef = await addDoc(collection(db, 'cities'), {
  name: 'Los Angeles',
  state: 'CA',
  country: 'USA'
});

console.log('Document written with ID: ', docRef.id);