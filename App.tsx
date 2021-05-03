import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "firebase/app";
import { AppRegistry } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "react-apollo";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import firebaseConfig from "./config/firebase";

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const client = new ApolloClient({
    uri: "https://frux-app-server.herokuapp.com/graphql",
    cache: new InMemoryCache(),
  });

  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <ThemeProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </ThemeProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent("main", () => App);
