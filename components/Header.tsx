import * as React from "react";
import { Text, Div, Icon, Image } from "react-native-magnus";

type Props = {
  icon: string;
  title: string;
};

interface IconType {
  [key: string]: { name: string; fontFamily: any };
}

export function Header(props: Props) {
  const icons: IconType = {
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
      {props.icon === "logo" ? (
        <Image
          h={80}
          w={80}
          borderWidth={2}
          rounded="circle"
          source={require("../assets/images/logo.png")}
        />
      ) : (
        <Icon
          bg="fruxbrown"
          p={20}
          h={60}
          w={60}
          rounded="circle"
          name={icons[props.icon].name}
          color="fruxgreen"
          borderWidth={2}
          fontSize="5xl"
          fontFamily={icons[props.icon].fontFamily}
        />
      )}
    </Div>
  );
}
