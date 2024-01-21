import { F as FIREBASE_CONFIG } from "../../chunks/dynamic.env.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
async function load(event) {
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);
  const postsCollection = collection(db, "posts");
  const q = query(postsCollection);
  const querySnapshot = await getDocs(q);
  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  return {
    url: event.url.pathname,
    posts
    // Add the posts array to the returned object
  };
}
export {
  load
};
