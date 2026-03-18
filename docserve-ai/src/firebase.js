import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

// Replace with your Firebase project config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD31mZ4l5k3r0AGK3apXLE7aN1_jGqlM7U",
  authDomain: "docserve-ai-1f16a.firebaseapp.com",
  projectId: "docserve-ai-1f16a",
  storageBucket: "docserve-ai-1f16a.firebasestorage.app",
  messagingSenderId: "454173704845",
  appId: "1:454173704845:web:3d314d516ebdd91d01d8c4",
  measurementId: "G-53RFSHN0FE"
};


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
export default app
