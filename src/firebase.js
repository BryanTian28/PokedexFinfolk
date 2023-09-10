// firebase.js
import { initializeApp } from "firebase/app";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Firebase config
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

//Initialize
export const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
	return app;
};

const auth = getAuth(app);
const firestore = getFirestore(app);
setPersistence(auth, browserLocalPersistence);
export { auth, firestore };
