import { gql } from "@apollo/client";
import { useQuery } from "@apollo/react-hooks";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Div, Text } from "react-native-magnus";

type Data = {
  user: {
    name: string;
    dbId: number;
  };
};
type Navigation = StackNavigationProp<any>;

function Component({
  data,
  navigation,
}: {
  data: Data;
  navigation: Navigation;
}) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UserScreen", { dbId: data.user.dbId })
      }
    >
      <Div alignItems="center" m="sm">
        <Div h={45} w={45} rounded="circle" borderWidth={1} />
        <Div mt="xs">
          <Text fontSize="xs" fontWeight="bold">
            {data.user.name}
          </Text>
        </Div>
      </Div>
    </TouchableOpacity>
  );
}

type Props = {
  navigation: Navigation;
  dbId: number;
};

export default function Render(props: Props) {
  const query = gql`
    query UserContainer($dbId: Int!) {
      user(dbId: $dbId) {
        dbId
        name
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
