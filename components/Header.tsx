import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import { loggingOut, useAuth } from "../auth";
import Notifications from "./Notifications";
import { AppIcons } from "../constants/Constants";

export default function Component({
  navigation,
  title,
  icon,
  onPress,
}: {
  icon: string;
  title: string;
  onPress?: any;
  navigation: StackNavigationProp<any>;
}) {
  // @ts-expect-error
  const { user } = useAuth();

  return (
    <Div
      alignItems="center"
      bgImg={require("../assets/images/forest.jpg")}
      p="2xl"
      h={200}
    >
      {user && (
        <>
          <Notifications navigation={navigation} />
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
              p="xs"
              mb="sm"
              onPress={() => navigation.navigate("ProjectScreen")}
            >
              <Icon
                name="add"
                color="white"
                fontFamily="Ionicons"
                fontSize="2xl"
              />
            </Button>
          </Div>
        </>
      )}
      <Text fontSize="5xl" fontFamily="latinmodernroman-bold" fontWeight="bold">
        {title}
      </Text>
      <TouchableHighlight onPress={onPress}>
        {icon === "logo" ? (
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
            m="md"
            bg="fruxbrown"
            h={50}
            w={50}
            rounded="circle"
            name={AppIcons[icon].name}
            color="fruxgreen"
            borderWidth={2}
            fontSize="2xl"
            fontFamily={AppIcons[icon].fontFamily}
          />
        )}
      </TouchableHighlight>
    </Div>
  );
}
