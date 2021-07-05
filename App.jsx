import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GRAPHQL_ENDPOINT } from "@env";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase/app";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { AppRegistry } from "react-native";
import { ThemeProvider } from "react-native-magnus";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "./constants/Colors";
import { firebaseConfig } from "./constants/Config";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { useAuth } from "./services/auth";

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const { token } = useAuth();
  const httpLink = createHttpLink({
    uri: GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
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

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={Colors.theme}>
            <Navigation colorScheme="light" />
            <StatusBar />
          </ThemeProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent("main", () => App);
