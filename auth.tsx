import * as Google from "expo-auth-session/providers/google";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import { FIREBASE_WEB_CLIENT_ID } from "@env";

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

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: FIREBASE_WEB_CLIENT_ID,
  });
  return [response, promptAsync];
};

export async function registration(email: string, password: string) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) return;

  const db = firebase.firestore();
  db.collection("users").doc(currentUser.uid).set({
    email: currentUser.email,
  });
}

export async function signIn(email: string, password: string) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    alert(err.message);
  }
}

export async function signInWithGoogle(response) {
  const { id_token } = response.params;
  const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
  await firebase.auth().signInWithCredential(credential);
}
