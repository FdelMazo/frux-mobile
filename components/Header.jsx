import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Div, Icon, Image, Text } from "react-native-magnus";
import { AppIcons } from "../constants/Constants";
import { loggingOut } from "../services/user";
import CreateProjectButton from "./CreateProjectButton";
import Notifications from "./Notifications";

export default function Component({
  viewerId,
  icon,
  title,
  onPress,
  navigation,
  mutations,
}) {
  return (
    <Div
      alignItems="center"
      bgImg={require("../assets/images/forest.jpg")}
      p="2xl"
      h={200}
    >
      {!!viewerId && (
        <>
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
          <Notifications user_id={viewerId} navigation={navigation} />
        </>
      )}

      <Text fontSize="5xl" fontFamily="latinmodernroman-bold">
        {title}
      </Text>
      <TouchableOpacity activeOpacity={onPress ? 0.2 : 1} onPress={onPress}>
        {icon === "logo" ? (
          <Image
            m="md"
            h={50}
            w={50}
            rounded="circle"
            borderWidth={2}
            source={require("../assets/images/logo.png")}
          />
        ) : (
          <Icon
            m="md"
            h={50}
            w={50}
            rounded="circle"
            borderWidth={2}
            name={AppIcons[icon].name}
            color="fruxgreen"
            bg="fruxbrown"
            fontFamily={AppIcons[icon].fontFamily}
            fontSize="2xl"
          />
        )}
      </TouchableOpacity>
    </Div>
  );
}
