import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Icon, Text } from "react-native-magnus";
import { AppIcons } from "../constants/Constants";

function Component({ data, navigation }) {
  const userPicture = data.user.imagePath || "seed";

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UserScreen", { dbId: data.user.dbId })
      }
    >
      <Div alignItems="center" m="sm">
        <Icon
          bg="fruxbrown"
          h={45}
          w={45}
          rounded="circle"
          name={AppIcons[userPicture].name}
          color="fruxgreen"
          borderWidth={1}
          fontSize="2xl"
          fontFamily={AppIcons[userPicture].fontFamily}
        />
        <Div mt="xs">
          <Text fontSize="xs" fontWeight="bold">
            {data.user.username || data.user.email.split("@")[0]}
          </Text>
        </Div>
      </Div>
    </TouchableOpacity>
  );
}

export default function Render(props) {
  const query = gql`
    query UserContainer($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        username
        email
        imagePath
      }
    }
  `;
  const { loading, error, data } = useQuery(query, {
    variables: { dbId: props.dbId },
  });
  if (error) alert(JSON.stringify(error));
  if (loading) return null;
  return <Component data={data} navigation={props.navigation} />;
}
