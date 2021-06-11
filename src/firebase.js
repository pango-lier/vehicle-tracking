import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/firebase-auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB8qk-4GRWZz6bQggeOCSnW01H1XWtfzC8',
  authDomain: 'vehicle-tracking-5946a.firebaseapp.com',
  projectId: 'vehicle-tracking-5946a',
  storageBucket: 'vehicle-tracking-5946a.appspot.com',
  messagingSenderId: '472702586901',
  appId: '1:472702586901:web:c1eb56d3018d2311f5be1c',
  measurementId: 'G-7HKJZ77XHH',
}
const fb = firebase.initializeApp(firebaseConfig)

const fs = fb.firestore()
const db = fb.database()
const dbVal = firebase.database
const auth = fb.auth()
export { fb, fs, db, dbVal, auth }
