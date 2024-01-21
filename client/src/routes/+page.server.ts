import { FIREBASE_CONFIG } from "$lib/@const/dynamic.env";
import type { RequestEvent } from "@sveltejs/kit";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

export type species = "deer" | "slug" | "tkey" | "coyo" | "racc";
export interface PostData {
	id: string;
	name: string;
	type: species;
	lat: number;
	lng: number;
	count: number;
	image_url: string;
	timestamp: number;
}

export async function load(event: RequestEvent) {
	// Initialize Firebase
	const app = initializeApp(FIREBASE_CONFIG);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	// Get a list of all documents, as well as their longitude and latitude values
	const postsCollection = collection(db, "posts"); // Reference to the 'posts' collection
	const q = query(postsCollection); // Create a query against the collection
	const querySnapshot = await getDocs(q); // Execute the query

	// Map the query results to an array of objects with document ID, lat, and lng
	const posts: PostData[] = querySnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as PostData[];

	return {
		url: event.url.pathname,
		posts: posts // Add the posts array to the returned object
	};
}
