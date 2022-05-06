import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  enableIndexedDbPersistence,
  collection,
  setDoc,
  getDoc,
  doc,
  query,
  limit,
  getDocs,
  where,
  orderBy,
} from 'firebase/firestore'

// store private keys in .env file
// the prefix GATSBY_ is necessary here
const config = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
  measurementId: process.env.GATSBY_MEASUREMENT_ID
}

// protect with conditional so gatsby build doesn't have
// issues trying to access the window object
let app
if (typeof window !== "undefined") {
  app = initializeApp(config)
  const db = getFirestore(app)
  enableIndexedDbPersistence(db)
    .catch(function (err) {
      if (err.code === "failed-precondition") {
        console.error(
          "firestore won't work offline with multiple tabs open"
        )
      } else if (err.code === "unimplemented") {
        console.error(
          "current browser can't take advantage of firestore offline"
        )
      }
    })
}

// authentication
// create user in the database
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  let result = await createUserWithEmailAndPassword(getAuth(), email, password)
  console.info('user created', result.user)
  const { user } = result
  await sendEmailVerification(user)
  console.info('email sent')
  // await setDoc(doc(db, "users"), { email: user.email })
  // console.info('doc added')
}

// login already existing user
export const doSignInWithEmailAndPassword = (email, password) =>
  signInWithEmailAndPassword(getAuth(), email, password)

// sign out user
export const doSignOut = () => signOut(getAuth())

// send email reset to email provided
export const doSendEmailVerification = (user) => sendEmailVerification(user)

// send email reset to email provided
export const doPasswordReset = email => sendPasswordResetEmail(getAuth(), email)

// change password to password provided
export const doPasswordUpdate = (user, password) => updatePassword(user, password)

export const authStateChanged = (next, error) => onAuthStateChanged(getAuth(), next, error)

export const getEntry = async (year, month, day, userId) => {
  const docRef = doc(getFirestore(app), "entries", `${year}${month}${day}-${userId}`)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return false
  }
}

// last 5 entries
export const getLastEntries = async (userId) => {
  const q = query(collection(getFirestore(app), 'entries'), where('userId', '==', userId), limit(5))
  const snapshots = await getDocs(q)
  return snapshots.docs.map(snapshot => snapshot.data())
}

export const getAllEntries = async (userId) => {
  const q = query(collection(getFirestore(app), 'entries'), where('userId', '==', userId))
  const snapshots = await getDocs(q)
  return snapshots.docs.map(snapshot => snapshot.data())
}

export const getFilteredEntries = async (userId, predicate) => {
  const entries = await getAllEntries(userId)
  return entries.filter(predicate)
}

export const saveText = async (text, year, month, day, userId) => {
  const docRef = doc(getFirestore(app), `/entries/${year}${month}${day}-${userId}`)
  return setDoc(docRef, {
    text,
    day: Number(day),
    year: Number(year),
    month: Number(month),
    userId
  }, { merge: true })
}