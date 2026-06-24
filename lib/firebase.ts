import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// مفاتيح الربط الخاصة بمنصتك
const firebaseConfig = {
  apiKey: "AIzaSyD1SL6dpODR328B007TQIAV6bzty3_F4To",
  authDomain: "mohannad-edu.firebaseapp.com",
  projectId: "mohannad-edu",
  storageBucket: "mohannad-edu.firebasestorage.app",
  messagingSenderId: "62556651027",
  appId: "1:62556651027:web:5b4a06aea78db71af7c9e6"
};

// تهيئة Firebase بطريقة تمنع تكرار التشغيل في Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// تجهيز خدمات المصادقة وقاعدة البيانات ومزود جوجل
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider(); // الإضافة الجديدة لجوجل

export { app, auth, db, googleProvider };