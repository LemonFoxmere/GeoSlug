/**
 * This file stores any environment variables that depends on production / development contexts.
 */

import { PUBLIC_DEV_API_HOST, PUBLIC_PROD_API_HOST } from "$env/static/public";

export const API_HOST = import.meta.env.DEV ? PUBLIC_DEV_API_HOST : PUBLIC_PROD_API_HOST;
export const FIREBASE_CONFIG = {
	apiKey: "AIzaSyCX9hgzjWFO-R3xcTp1ALnr5dgGySyBP-U",
	authDomain: "geoslug-7f33a.firebaseapp.com",
	projectId: "geoslug-7f33a",
	storageBucket: "gs://geoslug-7f33a.appspot.com",
	messagingSenderId: "1081118557427",
	appId: "1:1081118557427:web:d743a8f05fad3f39426386",
	measurementId: "G-5L29E542YP"
};
