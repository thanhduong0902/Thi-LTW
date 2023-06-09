import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCp0FrqILSYr7DpricSQJSbM2E17AgESAQ",
  authDomain: "granola-e41df.firebaseapp.com",
  databaseURL: "https://granola-e41df-default-rtdb.firebaseio.com",
  projectId: "granola-e41df",
  storageBucket: "granola-e41df.appspot.com",
  messagingSenderId: "878274398463",
  appId: "1:878274398463:web:0721ae9855d715e8b3e4ca",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };