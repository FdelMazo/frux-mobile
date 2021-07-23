import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import { AppIcons } from "../constants/Constants";
import { loggingOut, useUser } from "../services/user";
import CreateProjectButton from "./CreateProjectButton";
import Notifications from "./Notifications";

export default function Component({
  data,
  icon,
  title,
  onPress,
  navigation,
  mutations,
}) {
  const { user } = useUser();

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
                color="fruxred"
                fontFamily="Octicons"
                fontSize="2xl"
              />
            </Button>
          </Div>
          <Div position="absolute" bottom={0}>
            <CreateProjectButton
              navigation={navigation}
              mutations={mutations}
            />
          </Div>
        </>
      )}

      <Text fontSize="5xl" fontFamily="latinmodernroman-bold">
        {title}
      </Text>
      <TouchableOpacity activeOpacity={onPress ? 0.2 : 1} onPress={onPress}>
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
      </TouchableOpacity>
    </Div>
  );
}
