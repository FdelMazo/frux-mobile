import * as React from "react";
import { AppRegistry } from "react-native";
import { ThemeProvider } from "react-native-magnus";

import App from "./App";

export default function Main() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

AppRegistry.registerComponent("main", () => Main);
