import { gql } from "@apollo/client";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Icon, Text } from "react-native-magnus";
import { AppIcons } from "../constants/Constants";

export default function Component({ user, navigation }) {
  const userPicture = user.imagePath || "seed";

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("UserScreen", { dbId: user.dbId })}
    >
      <Div alignItems="center">
        <Icon
          bg={user.isBlocked ? undefined : "fruxbrown"}
          h={45}
          w={45}
          rounded="circle"
          name={user.isBlocked ? "block" : AppIcons[userPicture].name}
          color={user.isBlocked ? "fruxred" : "fruxgreen"}
          borderWidth={1}
          fontSize="2xl"
          fontFamily={
            user.isBlocked ? "Entypo" : AppIcons[userPicture].fontFamily
          }
        />
        <Div mt="xs">
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={user.isBlocked ? "fruxred" : "black"}
          >
            {user.username || user.email.split("@")[0]}
          </Text>
        </Div>
      </Div>
    </TouchableOpacity>
  );
}

Component.fragments = {
  user: gql`
    fragment UserContainer on User {
      id
      dbId
      username
      email
      isBlocked
      imagePath
    }
  `,
};
