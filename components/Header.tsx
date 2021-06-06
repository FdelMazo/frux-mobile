import * as React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Text, Div, Icon, Image, Drawer, Button } from "react-native-magnus";
import { loggingOut, useAuth } from "../auth";
import NotificationsList from "./NotificationsList";

type Props = {
  icon: string;
  title: string;
  onPress?: any;
  navigation: any;
};

interface IconType {
  [key: string]: { name: string; fontFamily: any };
}

export function Header(props: Props) {
  const icons: IconType = {
    projects: { name: "trees", fontFamily: "Foundation" },
    seed: { name: "seed-outline", fontFamily: "MaterialCommunityIcons" },
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
        <>
          <Div position="absolute" right={5} top={30}>
            <Button
              bg={undefined}
              onPress={() => {
                if (notificationsRef.current) {
                  notificationsRef.current.open();
                }
              }}
            >
              <Icon
                name="notifications"
                fontSize="2xl"
                color="black"
                fontFamily="Ionicons"
              />
            </Button>
          </Div>
          <Div position="absolute" right={0} bottom={0}>
            <Button bg={undefined} onPress={() => loggingOut()}>
              <Icon
                name="sign-out"
                color="red"
                fontFamily="Octicons"
                fontSize="2xl"
              />
            </Button>
          </Div>
          <Div position="absolute" bottom={0}>
            <Button
              bg="fruxgreen"
              borderColor="black"
              borderWidth={1}
              p={3}
              mb={5}
              onPress={() => props.navigation.navigate("ProjectScreen")}
            >
              <Icon
                name="add"
                color="white"
                fontFamily="Ionicons"
                fontSize="3xl"
              />
            </Button>
          </Div>
        </>
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
        <TouchableHighlight onPress={props.onPress}>
          <Icon
            m={10}
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
        </TouchableHighlight>
      )}
    </Div>
  );
}
