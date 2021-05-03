import * as React from "react";
import { Text, Div, Icon } from "react-native-magnus";

type Props = {
  icon: string;
  title: string;
};

export function Header(props: Props) {
  return (
    <Div
      alignItems="center"
      justifyContent="flex-start"
      bgImg={require("../assets/images/forest.jpg")}
      h={500}
    >
      <Text
        p={20}
        fontSize="6xl"
        fontFamily="latinmodernroman-bold"
        fontWeight="bold"
      >
        {props.title}
      </Text>
      <Icon
        bg="#8B7D3A"
        p={20}
        rounded="circle"
        name="tree"
        color="#006442"
        borderWidth={2}
        fontSize="5xl"
        fontFamily="Entypo"
      />
    </Div>
  );
}
