import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";

export const useUser = () => {
  const [state, setState] = React.useState(async () => {
    const user = firebase.auth().currentUser;
    const token = await user?.getIdToken(true);
    return { initializing: !user, user, token };
  });
  async function onChange(user) {
    const token = await user?.getIdToken(true);

    setState({ initializing: false, user, token });
  }

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return () => unsubscribe();
  }, []);

  return state;
};

export async function registration(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) return;

  const db = firebase.firestore();
  db.collection("users").doc(currentUser.uid).set({
    email: currentUser.email,
  });
}

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function loggingOut() {
  await firebase.auth().signOut();
}

export async function resetPassword(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}
