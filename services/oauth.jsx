import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from "@env";
import { makeRedirectUri, startAsync } from "expo-auth-session";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { LogBox } from "react-native";

// https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs([
  "Can't perform a React state update on an unmounted component.",
]);

export async function redirectToGithub() {
  const returnUrl = makeRedirectUri({
    scheme: "frux",
    path: "oauth",
  });
  const response = await startAsync({
    authUrl: `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&scope=user&redirect_uri=${returnUrl}`,
    returnUrl,
  });
  if (response.type === "cancel" || response.type === "dismiss")
    throw new Error("Sign in dismissed");
  if (response.type === "error") throw new Error("Sign in errored out");
  return response;
}

export async function signInWithGithub(response) {
  if (response?.type !== "success") return;
  const { code } = response.params;
  const token = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      code,
    }),
  })
    .then((res) => res.text())
    .then((data) => data.split("&")[0].split("=")[1]);

  const credential = firebase.auth.GithubAuthProvider.credential(token);
  await firebase.auth().signInWithCredential(credential);
}
