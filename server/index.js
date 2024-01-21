// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX9hgzjWFO-R3xcTp1ALnr5dgGySyBP-U",
  authDomain: "geoslug-7f33a.firebaseapp.com",
  projectId: "geoslug-7f33a",
  storageBucket: "gs://geoslug-7f33a.appspot.com",
  messagingSenderId: "1081118557427",
  appId: "1:1081118557427:web:d743a8f05fad3f39426386",
  measurementId: "G-5L29E542YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Storage =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Authenticator =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const provider = new GoogleAuthProvider();
const auth = getAuth();
signInWithRedirect(auth, provider);

getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  }); 
  

  onAuthStateChanged (auth, user => {
    if (user != null) {
      console.log("logged in");
    } else {
      consolee.log("not logged in");
    }
  });