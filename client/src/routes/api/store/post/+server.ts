import { FIREBASE_CONFIG } from "$lib/@const/dynamic.env"; // Your Firebase config
import type { PostData } from "$route/+page.server";
import { error, json } from "@sveltejs/kit";
import { initializeApp } from "firebase/app"; // Ensure Firebase is initialized
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"; // Import Firestore modules
import type { RequestHandler } from "./$types";

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

export const POST: RequestHandler = async ({ request }) => {
	const resp = await request.json();

	let post: PostData;
	try {
		post = resp.payload;
	} catch (e) {
		throw error(400, `Bad request: ${e}`);
	}

	try {
		// Now, save the new document to Firestore with the download URL
		const newPostRef = doc(collection(db, "posts"));
		await setDoc(newPostRef, post);

		return json(post.id);
	} catch (e) {
		console.error("Upload failed", e);
		throw error(500, `Internal server error: ${e}`);
	}
};
