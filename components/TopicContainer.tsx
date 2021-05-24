import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import NotificationsList from "./NotificationsList";

type Props = {
  name: string;
  img: string;
};

export function TopicContainer(props: Props) {
  return (
    <Div flexDir="column" alignItems="center">
      <Div
        h={50}
        w={50}
        m={10}
        borderWidth={1}
        rounded="circle"
        bgImg={{ uri: props.img }}
      />
      <Div>
        <Text fontWeight="bold">{props.name}</Text>
      </Div>
    </Div>
  );
}
