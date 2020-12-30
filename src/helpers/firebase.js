import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
}
  
firebase.initializeApp(firebaseConfig)
  
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const fbProvider = new firebase.auth.FacebookAuthProvider()

export const auth = firebase.auth()
export const db = firebase.database()

export const custom_firebase = firebase.auth
