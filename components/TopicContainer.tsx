import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import NotificationsList from "./NotificationsList";

type Props = {
  name: string;
  img: string;
};

export function TopicContainer(props: Props) {
  return (
    <Div flexDir="column" alignItems="center" m={4}>
      <Div
        h={35}
        w={35}
        m={10}
        bg="white"
        style={{ transform: [{ rotate: "45deg" }] }}
        borderWidth={1}
        p={2}
      >
        <Div
          h="100%"
          bgImg={{ uri: props.img }}
          style={{ transform: [{ rotate: "315deg" }] }}
        />
      </Div>
      <Div>
        <Text fontWeight="bold">{props.name}</Text>
      </Div>
    </Div>
  );
}
