import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import NotificationsList from "./NotificationsList";

type Props = {
  name: string;
  showName: boolean;
  img: string;
};

export function TopicContainer(props: Props) {
  const IMG = {
    Tech: require(`../assets/images/topics/tech.png`),
    Art: require(`../assets/images/topics/art.png`),
    Books: require(`../assets/images/topics/books.png`),
    Film: require(`../assets/images/topics/film.png`),
    Food: require(`../assets/images/topics/food.png`),
    Games: require(`../assets/images/topics/games.png`),
    Music: require(`../assets/images/topics/music.png`),
    Other: require(`../assets/images/topics/other.png`),
  };

  return (
    <Div flexDir="column" alignItems="center" m={4}>
      <Div
        p={7}
        h={45}
        w={45}
        m={7}
        bg="white"
        style={{ transform: [{ rotate: "45deg" }] }}
        borderWidth={1}
      >
        <Div
          h="100%"
          bgImg={IMG[props.name]}
          style={{ transform: [{ rotate: "315deg" }] }}
        />
      </Div>
      {props.showName && (
        <Div>
          <Text fontWeight="bold">{props.name}</Text>
        </Div>
      )}
    </Div>
  );
}
