import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import firebase from "firebase/app";
import { AppRegistry } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "react-apollo";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import firebaseConfig from "./config/firebase";
import { useAuth } from "./auth";

const theme = {
  colors: {
    fruxgreen: "#90B44B",
    fruxbrown: "#896C39",
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const { token } = useAuth();
  const httpLink = createHttpLink({
    uri: "https://frux-app-server.herokuapp.com/graphql",
  });
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </ThemeProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent("main", () => App);
