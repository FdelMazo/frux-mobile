import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { Div, Text } from "react-native-magnus";
import { TopicImage } from "../constants/Constants";

export default function Component({
  name,
  showName,
  navigation,
}: {
  name: string;
  showName: boolean;
  navigation: StackNavigationProp<any>;
}) {
  return (
    <Div flexDir="column" alignItems="center" m="sm">
      <Div
        p="md"
        h={45}
        w={45}
        m="md"
        bg="white"
        style={{ transform: [{ rotate: "45deg" }] }}
        borderWidth={1}
      >
        <Div
          h="100%"
          bgImg={TopicImage[name]}
          style={{ transform: [{ rotate: "315deg" }] }}
        />
      </Div>
      {showName && (
        <Div mt="xs">
          <Text fontWeight="bold">{name}</Text>
        </Div>
      )}
    </Div>
  );
}
