import { gql } from "@apollo/client";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { graphql } from "graphql";
import React from "react";

export const useAuth = () => {
  const [state, setState] = React.useState(async () => {
    const user = firebase.auth().currentUser;
    const token = await user?.getIdToken();
    return { initializing: !user, user, token };
  });
  async function onChange(user) {
    const token = await user?.getIdToken();

    setState({ initializing: false, user, token });
  }

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return () => unsubscribe();
  }, []);

  return state;
};

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
