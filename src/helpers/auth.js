import { auth , googleProvider , fbProvider } from './firebase'

export function signup(email,password) {
    return auth.createUserWithEmailAndPassword(email,password)
}

export function signin(email,password) {
    return auth.signInWithEmailAndPassword(email,password)
}

export function signout() {
    return auth.signOut()
}

export function resetemail(email) {
    return auth.sendPasswordResetEmail(email)
}

export function signInWithGoogle() {
    return auth.signInWithPopup(googleProvider)
}

export function signInWithFacebook() {
    return auth.signInWithPopup(fbProvider)
}