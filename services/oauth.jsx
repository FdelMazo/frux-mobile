import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@env";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

  const redirectToGithub = async () => {
    promptAsync({
      useProxy: true,
      redirectUri: makeRedirectUri({
        scheme: "frux",
        path: "oauth",
      }),
    });
  };

  return [response, redirectToGithub];
};

export async function signInWithGithub(response) {
  if (response?.type !== "success") return;
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
