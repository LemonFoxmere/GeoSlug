import { F as FIREBASE_CONFIG } from "../../../../../chunks/dynamic.env.js";
import { e as error, j as json } from "../../../../../chunks/index.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const POST = async ({ request }) => {
  const resp = await request.json();
  let post;
  try {
    post = resp.payload;
  } catch (e) {
    throw error(400, `Bad request: ${e}`);
  }
  try {
    const newPostRef = doc(collection(db, "posts"));
    await setDoc(newPostRef, post);
    return json(post.id);
  } catch (e) {
    console.error("Upload failed", e);
    throw error(500, `Internal server error: ${e}`);
  }
};
export {
  POST
};
