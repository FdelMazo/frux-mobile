import * as React from "react";
import { Div, Text } from "react-native-magnus";

export default function Component({
  name,
  showName,
}: {
  name: string;
  showName: boolean;
}) {
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
          bgImg={IMG[name]}
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
