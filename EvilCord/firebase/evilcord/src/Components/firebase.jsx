import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBd4I8SWdCSIFcfCM7KcoxoMAZBFw7CqSA",
    authDomain: "discord-clone-xam.firebaseapp.com",
    projectId: "discord-clone-xam",
    storageBucket: "discord-clone-xam.appspot.com",
    messagingSenderId: "336159482606",
    appId: "1:336159482606:web:c05ec94c529391f5f3c9ff",
    measurementId: "G-CSL39CVDGD"
  };

  const firebaseapp = firebase.initializeApp(firebaseConfig);
  const db = firebaseapp.firestore();
  const auth = firebase.auth();
  const providor = new firebase.auth.GoogleAuthProvider();

  export {auth,providor};
  export default db;