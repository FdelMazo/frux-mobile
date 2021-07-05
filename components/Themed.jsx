import * as React from "react";
import {
  ScrollView as DefaultScrollView,
  StyleSheet,
  View as DefaultView,
} from "react-native";
import Colors from "../constants/Colors";

export function View(props) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = Colors.background;
  const defaultStyle = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <DefaultView
      style={[{ backgroundColor }, defaultStyle.container, style]}
      {...otherProps}
    />
  );
}

export function MainView(props) {
  const { style, lightColor, ...otherProps } = props;
  const backgroundColor = Colors.background;

  return (
    <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps}>
      <DefaultView
        style={[
          { backgroundColor },
          {
            flex: 1,
            alignItems: "center",
          },
          style,
        ]}
        {...otherProps}
      >
        {props.children}
      </DefaultView>
    </DefaultScrollView>
  );
}
