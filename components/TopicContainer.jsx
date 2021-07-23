import * as React from "react";
import { Div, Text } from "react-native-magnus";
import { TopicImage } from "../constants/Constants";

export default function Component({ name, showName, active }) {
  return (
    <Div alignItems="center">
      <Div
        p="md"
        h={45}
        w={45}
        m={9} // Not quite sm, not quite md!
        bg="white"
        style={{ transform: [{ rotate: "45deg" }] }}
        borderWidth={active ? 2 : 1}
        borderColor={active ? "fruxgreen" : "black"}
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
