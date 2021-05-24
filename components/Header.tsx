import * as React from "react";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import { useAuth } from "../auth";
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
    projects: { name: "trees", fontFamily: "Foundation" },
    seed: { name: "seed", fontFamily: "MaterialCommunityIcons" },
    discover: { name: "seedling", fontFamily: "FontAwesome5" },
  };
  const notificationsRef = React.createRef();
  const { user } = useAuth();
  return (
    <Div
      alignItems="center"
      justifyContent="flex-start"
      bgImg={require("../assets/images/forest.jpg")}
      p={30}
      h={200}
    >
      <Drawer direction="right" ref={notificationsRef}>
        <NotificationsList />
      </Drawer>

      {user && (
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
      )}
      <Text fontSize="5xl" fontFamily="latinmodernroman-bold" fontWeight="bold">
        {props.title}
      </Text>
      {props.icon === "logo" ? (
        <Image
          h={50}
          w={50}
          borderWidth={2}
          borderColor="black"
          rounded="circle"
          source={require("../assets/images/logo.png")}
        />
      ) : (
        <Icon
          bg="fruxbrown"
          h={50}
          w={50}
          rounded="circle"
          name={icons[props.icon].name}
          color="fruxgreen"
          borderWidth={2}
          fontSize="2xl"
          fontFamily={icons[props.icon].fontFamily}
        />
      )}
    </Div>
  );
}
