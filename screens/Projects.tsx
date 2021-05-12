import * as React from "react";
import { StyleSheet } from "react-native";

import { View } from "../components/Themed";
import { Icon, Input, Div, Tag, Text, Skeleton } from "react-native-magnus";
import { Header } from "../components/Header";

export default function Projects() {
  return (
    <>
      <Header title="Projects" icon="projects" />
      <View>
        <Div w="65%" mt={25}>
          <Div>
            <Text fontSize="xl">My Topics</Text>
            <Skeleton.Box mt="sm" />
            <Skeleton.Box mt="sm" />
            <Skeleton.Box mt="sm" />
            <Skeleton.Box mt="sm" />
          </Div>
        </Div>
      </View>
    </>
  );
}
