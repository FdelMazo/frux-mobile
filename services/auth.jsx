import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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

export const useGithubAuth = () => {
  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "frux",
        path: "oauth",
      }),
    },
    discovery
  );

  return [response, promptAsync];
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

export async function signInWithGithub(response) {
  const { code } = response.params;
  const token = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  })
    .then((res) => res.text())
    .then((data) => data.split("&")[0].split("=")[1]);

  const credential = firebase.auth.GithubAuthProvider.credential(token);
  await firebase.auth().signInWithCredential(credential);
}

export async function resetPassword(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}
