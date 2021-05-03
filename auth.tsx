import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export async function registration(email: string, password: string) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return;

    const db = firebase.firestore();
    db.collection("users").doc(currentUser.uid).set({
      email: currentUser.email,
    });
  } catch (err) {
    alert(err.message);
  }
}

export async function signIn(email: string, password: string) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    alert(err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    alert(err.message);
  }
}

export async function signInWithGithub() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {})
    .catch((error) => {
      alert(error.message);
    });
}
