import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { ImageSourcePropType } from "react-native";
import { Div, Text } from "react-native-magnus";

interface ImgType {
  [key: string]: ImageSourcePropType;
}

export default function Component({
  name,
  showName,
  navigation,
}: {
  name: string;
  showName: boolean;
  navigation: StackNavigationProp<any>;
}) {
  const IMG: ImgType = {
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
