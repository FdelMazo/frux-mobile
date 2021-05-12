import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import NotificationsList from "./NotificationsList";

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
    seed: { name: "seed", fontFamily: "MaterialCommunityIcons" },
  };
  const notificationsRef = React.createRef();

  return (
    <Div
      alignItems="center"
      justifyContent="flex-start"
      bgImg={require("../assets/images/forest.jpg")}
      h={300}
    >
      <Drawer direction="right" ref={notificationsRef}>
        <NotificationsList />
      </Drawer>
      <Div alignSelf="flex-end">
        <Button
          bg={undefined}
          onPress={() => {
            if (notificationsRef.current) {
              notificationsRef.current.open();
            }
          }}
        >
          <Icon name="notifications" color="black" fontFamily="Ionicons" />
        </Button>
      </Div>
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
