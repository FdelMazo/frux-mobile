import * as React from "react";
import { Text, Div, Icon } from "react-native-magnus";

type Props = {
  icon: string;
  title: string;
};

interface IconType {
  [key: string]: { name: string; fontFamily: any };
}

export function Header(props: Props) {
  const icons: IconType = {
    logo: { name: "tree", fontFamily: "Entypo" },
    projects: { name: "seedling", fontFamily: "FontAwesome5" },
  };
  return (
    <Div
      alignItems="center"
      justifyContent="flex-start"
      bgImg={require("../assets/images/forest.jpg")}
      h={300}
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
        bg="#896C39"
        p={20}
        rounded="circle"
        name={icons[props.icon].name}
        color="#90B44B"
        borderWidth={2}
        fontSize="5xl"
        fontFamily={icons[props.icon].fontFamily}
      />
    </Div>
  );
}
